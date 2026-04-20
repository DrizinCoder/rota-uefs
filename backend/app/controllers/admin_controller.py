import uuid

from app.DTOs.users.dtos import CreateAdminDTO
from app.services.admin_service import AdminService


class AdminController:
    def __init__(self, service: AdminService):
        self.service = service

    async def create(self, admin_data: CreateAdminDTO):
        admin = await self.service.create_admin(admin_data)
        return self.service.serialize_admin_response(admin)

    async def list_all(self):
        admins = await self.service.list_all_admins()
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