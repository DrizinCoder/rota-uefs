import uuid
from app.DTOs.auth import RegisterAdminDTO
from app.DTOs.users import CreateAdminDTO
from app.services.admin_service import AdminService


class AdminController:
    def __init__(self, service: AdminService):
        self.service = service

    async def create(self, dados: RegisterAdminDTO):
        admin_data = CreateAdminDTO(
            full_name=dados.full_name,
            registration_id=dados.registration_id,
            phone=dados.phone or "Not Defined",
            email=dados.email,
            password=dados.password or "default_password",
            profile=dados.profile,
            access_level=dados.access_level.value if dados.access_level else "Operator"
        )
        
        admin = await self.service.create_admin(admin_data)
        return self.service.serialize_admin_response(admin)

    async def list_all(self):
        admins = await self.service.get_alls_admins()
        if not admins:
            return []
        return self.service.serialize_admin_list(admins)

    async def get_by_id(self, admin_id: uuid.UUID):
        admin = await self.service.get_admin_by_id(admin_id)
        if not admin:
            return None
        return self.service.serialize_admin_detail(admin)

    async def update(self, admin_id: uuid.UUID, update_data: dict):
        admin = await self.service.update_admin(admin_id, update_data)
        if not admin:
            return None
        return self.service.serialize_admin_update(admin)

    async def delete(self, admin_id: uuid.UUID):
        return await self.service.delete_admin(admin_id)
