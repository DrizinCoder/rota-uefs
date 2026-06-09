import uuid
from app.repositories.user_repository import pwd_context
from app.core.exceptions import BadRequestException, ConflictException, NotFoundException, UnprocessableEntityException
from app.repositories.user_repository import UserRepository

from app.DTOs.users import PasswordUpdate, PhoneUpdate
import logging

logger = logging.getLogger(__name__)


class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def get_by_id_without_password(self, id: str):
        logger.info(f"User lookup requested | User ID: {id}")

        user = await self.repository.get_by_id_without_password(id)

        if not user:
            raise NotFoundException("Usuário não encontrado.")

        logger.info(f"User retrieved successfully | User ID: {id}")
        return user

    async def check_email_available(self, email: str):
        logger.info(f"Email availability check requested | Email: {email}")

        existing = await self.repository.get_by_email(email)
        if existing:
            raise ConflictException("Este e-mail já está em uso por outro usuário.")

        logger.info(f"Email is available | Email: {email}")

    async def update_email(self, user_id: uuid.UUID, new_email: str):
        logger.info(f"Email update requested | User ID: {user_id}")

        user = await self.repository.get_by_id(user_id)
        if not user:
            raise NotFoundException("Usuário não encontrado.")
        user.email = new_email
        await self.repository.update(user)

        logger.info(f"Email updated successfully | User ID: {user_id}")

    async def update_password(self, user_id: uuid.UUID, data: PasswordUpdate):
        logger.info(f"Password update requested | User ID: {user_id}")

        user = await self.repository.get_by_id(user_id)
        if not user:
            raise NotFoundException("Usuário não encontrado!")

        if data.password != data.confirm_password:
            raise BadRequestException("As senhas não coincidem!")

        if pwd_context.verify(data.password, user.password):
            raise UnprocessableEntityException("A nova senha não pode ser igual à senha atual!")

        data.password = pwd_context.hash(data.password)

        updated_user = await self.repository.patch(user_id, data)
        if not updated_user:
            raise NotFoundException("Erro ao atualizar senha!")

        logger.info(f"Password updated successfully | User ID: {user_id}")
        return updated_user
    
    async def update_phone(self, user_id: uuid.UUID, data: PhoneUpdate):
        logger.info(f"Phone update requested | User ID: {user_id}")

        updated_user = await self.repository.patch(user_id, data)
        if not updated_user:
            raise NotFoundException("Usuário não encontrado!")

        logger.info(f"Phone updated successfully | User ID: {user_id}")
        return updated_user

    async def delete_account(self, user_id: str):
        logger.info(f"Account deletion requested | User ID: {user_id}")

        deleted_user = await self.repository.anonymize(user_id)
        if not deleted_user:
            raise NotFoundException("Usuário não encontrado!")

        logger.info(f"Account deleted successfully | User ID: {user_id}")
        return deleted_user

    async def list_students(self):
        logger.info("Student list requested")

        result = await self.repository.list_all_students()

        logger.info(f"Student list retrieved successfully | Count: {len(result) if result else 0}")
        return result

    async def get_student_by_registration(self, registration_id: str):
        logger.info(f"Student lookup requested | Registration: {registration_id}")

        user = await self.repository.get_by_registration_id(registration_id)
        if not user:
            raise NotFoundException("Estudante não encontrado!")

        logger.info(f"Student retrieved successfully | Registration: {registration_id}")
        return user
    