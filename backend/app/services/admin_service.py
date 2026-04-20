import uuid
from typing import Optional, List, Dict, Any
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext

from app.DTOs.users.dtos import CreateAdminDTO
from app.enums.enums import UserProfile, AccessLevel, RegistrationStatus
from app.models.models import User, Admin
from app.repositories.user_repository import UserRepository
from app.core.exceptions import ConflictException, NotFoundException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AdminService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    async def create_admin(self, admin_data: CreateAdminDTO) -> Admin:
        user = User(
            full_name=admin_data.full_name,
            password=admin_data.password,
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
        await self.user_repository.session.refresh(admin)

        return admin

    async def get_admin_by_id(self, admin_id: uuid.UUID) -> Optional[Admin]:
        return await self.user_repository.get_by_id(admin_id)

    async def list_all_admins(self) -> List[Admin]:
        return await self.user_repository.list_all_admins()

    async def update_admin(self, admin_id: uuid.UUID, update_data: dict) -> Optional[Admin]:
        admin = await self.user_repository.get_by_id(admin_id)
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
        if "password" in update_data:
            admin.user.password = pwd_context.hash(update_data["password"])
        if "access_level" in update_data:
            admin.access_level = AccessLevel(update_data["access_level"])

        return await self.user_repository.update(admin.user)

    async def delete_admin(self, admin_id: uuid.UUID) -> bool:
        admin = await self.user_repository.get_by_id(admin_id)
        if not admin:
            return False

        admin.user.is_anonymized = True
        await self.user_repository.session.commit()
        return True
    
    def _serialize_admin(self, admin: Admin) -> Dict[str, Any]:
        return {
            "admin_id": str(admin.admin_id),
            "full_name": admin.user.full_name,
            "email": admin.user.email,
            "phone": admin.user.phone,
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

    def serialize_admin_update(self, admin: User) -> Dict[str, Any]:
        return {
            "admin_id": str(admin.user_id),
            "full_name": admin.full_name,
            "email": admin.email,
            "phone": admin.phone
        }