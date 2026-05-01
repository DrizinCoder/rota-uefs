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
                return existing_admin
            
            admin = Admin(
                admin_id=existing_user.user_id,
                access_level=AccessLevel(admin_data.access_level)
            )
            self.user_repository.session.add(admin)
            await self.user_repository.session.commit()
            await self.user_repository.session.refresh(admin)
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

        return await self.get_admin_by_id(user.user_id)

    async def get_admin_by_id(self, admin_id: uuid.UUID) -> Optional[Admin]:
        return await self.user_repository.get_admin_full(admin_id)

    async def get_alls_admins(self) -> List[Admin]:
        return await self.user_repository.list_all_admins_full()

    async def update_admin(self, admin_id: uuid.UUID, update_data: dict) -> Optional[Admin]:
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
        return admin

    async def delete_admin(self, admin_id: uuid.UUID) -> bool:
        admin = await self.user_repository.get_admin_full(admin_id)  
        if not admin:
            return False
        
        if admin.user.is_anonymized:
            return False

        return await self.user_repository.anonymize(admin_id)

    async def register_motorista(self, dados: RegisterMotoristaDTO):
        driver = await self.user_repository.get_by_registration_id(dados.registration_id)
        if driver:
            raise ConflictException("Motorista já cadastrado")
        
        driver_created, temp_password = await self.user_repository.create_driver(dados)
        return driver_created, temp_password

    async def delete_account(self, user_id: uuid.UUID):
        deleted_user = await self.user_repository.anonymize(user_id)
        if not deleted_user:
            return None
        return deleted_user

    async def list_drivers(self):
        return await self.user_repository.list_all_drivers()

    async def list_staff_status_pending(self):
        return await self.user_repository.list_all_staff_status_peding()

    async def get_driver(self, driver_id: uuid.UUID):
        return await self.user_repository.get_by_id(driver_id)

    async def update_status_staff(self, user_id: uuid.UUID, status: bool):
        user = await self.user_repository.update_status_staff(user_id, status)
        if not user:
            raise NotFoundException("Usuário não encontrado")
        
        if status == False:
            await self.user_repository.anonymize(user_id)
            return True
        
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
          