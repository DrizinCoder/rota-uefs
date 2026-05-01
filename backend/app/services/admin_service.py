from app.core.exceptions import NotFoundException
from app.DTOs.auth import RegisterMotoristaDTO
import uuid
from typing import Optional, List, Dict, Any
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

from app.DTOs.users import CreateAdminDTO
from app.enums.enums import UserProfile, AccessLevel, RegistrationStatus
from app.models.models import User, Admin
from app.repositories.user_repository import UserRepository
from app.core.exceptions import ConflictException
import logging

logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



class AdminService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    async def create_admin(self, admin_data: CreateAdminDTO) -> Admin:
        logger.info(f"Admin creation requested | Registration: {admin_data.registration_id}")

        existing_user = await self.user_repository.get_by_registration_id(admin_data.registration_id)
        
        if existing_user and not existing_user.is_anonymized:
            raise ConflictException("Registration ID já está em uso")
        
        if existing_user and existing_user.is_anonymized:
            
            password_bytes = admin_data.password.encode('utf-8')
            if len(password_bytes) > 72:
                password_bytes = password_bytes[:72]
            password = password_bytes.decode('utf-8', errors='ignore')
                    
            hashed_password = pwd_context.hash(password)    
            
            existing_user.full_name = admin_data.full_name
            existing_user.password = hashed_password
            existing_user.phone = admin_data.phone
            existing_user.email = admin_data.email
            existing_user.profile = UserProfile.ADMIN
            existing_user.registration_status = RegistrationStatus.ACTIVE
            existing_user.is_anonymized = False
            
            await self.user_repository.session.commit()
            await self.user_repository.session.refresh(existing_user)
            
            existing_admin = await self.user_repository.get_admin_full(existing_user.user_id)
            if existing_admin:
                existing_admin.access_level = AccessLevel(admin_data.access_level)
                await self.user_repository.session.commit()
                logger.info(f"Admin created successfully (reactivated) | Admin ID: {existing_admin.admin_id}")
                return existing_admin
            
            admin = Admin(
                admin_id=existing_user.user_id,
                access_level=AccessLevel(admin_data.access_level)
            )
            self.user_repository.session.add(admin)
            await self.user_repository.session.commit()
            await self.user_repository.session.refresh(admin)
            logger.info(f"Admin created successfully (reactivated) | Admin ID: {admin.admin_id}")
            return admin

        password_bytes = admin_data.password.encode('utf-8')
        if len(password_bytes) > 72:
            password_bytes = password_bytes[:72]
        password = password_bytes.decode('utf-8', errors='ignore')
        
        hashed_password = pwd_context.hash(password)
        
        user = User(
            full_name=admin_data.full_name,
            password=hashed_password,
            registration_id=admin_data.registration_id,
            phone=admin_data.phone,
            email=admin_data.email,
            profile=UserProfile.ADMIN,
            registration_status=RegistrationStatus.ACTIVE
        )

        try:
            self.user_repository.session.add(user)
            await self.user_repository.session.commit()
            await self.user_repository.session.refresh(user)
        except IntegrityError as e:
            await self.user_repository.session.rollback()
            error_msg = str(e.orig).lower()
            if "email" in error_msg:
                raise ConflictException("Email já está em uso")
            elif "registration_id" in error_msg:
                raise ConflictException("Registration ID já está em uso")
            raise ConflictException("Dados duplicados")

        admin = Admin(
            admin_id=user.user_id,
            access_level=AccessLevel(admin_data.access_level)
        )

        self.user_repository.session.add(admin)
        await self.user_repository.session.commit()

        logger.info(f"Admin created successfully | Admin ID: {user.user_id}")
        return await self.get_admin_by_id(user.user_id)

    async def get_admin_by_id(self, admin_id: uuid.UUID) -> Optional[Admin]:
        logger.info(f"Admin lookup requested | Admin ID: {admin_id}")

        result = await self.user_repository.get_admin_full(admin_id)

        logger.info(f"Admin lookup completed | Admin ID: {admin_id} | Found: {result is not None}")
        return result

    async def get_alls_admins(self) -> List[Admin]:
        logger.info("Admin list requested")

        result = await self.user_repository.list_all_admins_full()

        logger.info(f"Admin list retrieved successfully | Count: {len(result) if result else 0}")
        return result

    async def update_admin(self, admin_id: uuid.UUID, update_data: dict) -> Optional[Admin]:
        logger.info(f"Admin update requested | Admin ID: {admin_id}")

        admin = await self.user_repository.get_admin_full(admin_id)  
        if not admin:
            return None

        if "full_name" in update_data:
            admin.user.full_name = update_data["full_name"]
        if "phone" in update_data:
            admin.user.phone = update_data["phone"]
        if "email" in update_data:
            existing = await self.user_repository.get_by_email(update_data["email"])
            if existing and existing.user_id != admin_id:
                raise ConflictException("Email já está em uso")
            admin.user.email = update_data["email"]
        if "access_level" in update_data:
            admin.access_level = AccessLevel(update_data["access_level"])

        await self.user_repository.session.commit()
        await self.user_repository.session.refresh(admin)

        logger.info(f"Admin updated successfully | Admin ID: {admin_id}")
        return admin

    async def delete_admin(self, admin_id: uuid.UUID) -> bool:
        logger.info(f"Admin deletion requested | Admin ID: {admin_id}")

        admin = await self.user_repository.get_admin_full(admin_id)  
        if not admin:
            return False
        
        if admin.user.is_anonymized:
            return False

        result = await self.user_repository.anonymize(admin_id)

        logger.info(f"Admin deleted successfully | Admin ID: {admin_id}")
        return result

    async def register_motorista(self, dados: RegisterMotoristaDTO):
        logger.info(f"Driver registration requested | Registration: {dados.registration_id}")

        driver = await self.user_repository.get_by_registration_id(dados.registration_id)
        if driver:
            raise ConflictException("Motorista já cadastrado")
        
        driver_created, temp_password = await self.user_repository.create_driver(dados)

        logger.info(f"Driver registered successfully | Registration: {dados.registration_id}")
        return driver_created, temp_password

    async def delete_account(self, user_id: uuid.UUID):
        logger.info(f"Account deletion requested | User ID: {user_id}")

        deleted_user = await self.user_repository.anonymize(user_id)
        if not deleted_user:
            return None

        logger.info(f"Account deleted successfully | User ID: {user_id}")
        return deleted_user

    async def list_drivers(self):
        logger.info("Drivers list requested")

        result = await self.user_repository.list_all_drivers()

        logger.info(f"Drivers list retrieved successfully | Count: {len(result) if result else 0}")
        return result

    async def list_staff_status_pending(self):
        logger.info("Pending staff list requested")

        result = await self.user_repository.list_all_staff_status_peding()

        logger.info(f"Pending staff list retrieved successfully | Count: {len(result) if result else 0}")
        return result

    async def get_driver(self, driver_id: uuid.UUID):
        logger.info(f"Driver lookup requested | Driver ID: {driver_id}")

        result = await self.user_repository.get_by_id(driver_id)

        logger.info(f"Driver lookup completed | Driver ID: {driver_id} | Found: {result is not None}")
        return result

    async def update_status_staff(self, user_id: uuid.UUID, status: bool):
        logger.info(f"Staff status update requested | User ID: {user_id} | Status: {status}")

        user = await self.user_repository.update_status_staff(user_id, status)
        if not user:
            raise NotFoundException("Usuário não encontrado")
        
        if status == False:
            await self.user_repository.anonymize(user_id)
            logger.info(f"Staff status updated and anonymized | User ID: {user_id}")
            return True

        logger.info(f"Staff status updated successfully | User ID: {user_id} | Status: {status}")
        return user

    def _serialize_admin(self, admin: Admin) -> Dict[str, Any]:
        return {
            "admin_id": str(admin.admin_id),
            "full_name": admin.user.full_name,
            "email": admin.user.email,
            "phone": admin.user.phone,
            "registration_id": admin.user.registration_id,
            "access_level": admin.access_level.value,
            "registration_status": admin.user.registration_status.value
        }

    def serialize_admin_response(self, admin: Admin) -> Dict[str, Any]:
        return {
            "admin_id": str(admin.admin_id),
            "full_name": admin.user.full_name,
            "email": admin.user.email,
            "access_level": admin.access_level.value
        }

    def serialize_admin_list(self, admins: List[Admin]) -> List[Dict[str, Any]]:
        return [self._serialize_admin(admin) for admin in admins]

    def serialize_admin_detail(self, admin: Admin) -> Dict[str, Any]:
        return self._serialize_admin(admin)

    def serialize_admin_update(self, admin: Admin) -> Dict[str, Any]:
        return {
            "admin_id": str(admin.admin_id),
            "full_name": admin.user.full_name,
            "email": admin.user.email,
            "phone": admin.user.phone
        }
          