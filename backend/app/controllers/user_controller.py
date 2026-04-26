import uuid
from app.services.user_service import UserService

class UserController:
    def __init__(self, user_service: UserService):
        self.user_service = user_service

    async def list_students(self):
        return await self.user_service.list_students()

    async def get_student_by_registration(self, registration_id: str):
        return await self.user_service.get_student_by_registration(registration_id)

    async def request_email_change(self, user_id: uuid.UUID, new_email: str, base_url: str):
        return await self.user_service.request_email_change(user_id, new_email, base_url)

    async def confirm_email_change(self, token: str):
        return await self.user_service.confirm_email_change(token)