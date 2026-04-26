import uuid
from datetime import timedelta
from jose import jwt, JWTError

from app.core.config import settings
from app.core.exceptions import ConflictException, BadRequestException, NotFoundException
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.email.use_cases import EmailUseCases
from fastapi.responses import RedirectResponse

class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def check_email_available(self, email: str):
        existing = await self.repository.get_by_email(email)
        if existing:
            raise ConflictException("Este e-mail já está em uso por outro usuário.")

    async def update_email(self, user_id: uuid.UUID, new_email: str):
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise NotFoundException("Usuário não encontrado.")
        user.email = new_email
        await self.repository.update(user)

    async def list_students(self):
        return await self.repository.list_all_students()

    async def get_student_by_registration(self, registration_id: str):
        user = await self.repository.get_by_registration_id(registration_id)
        if not user:
            raise NotFoundException("Estudante não encontrado!")
        return user