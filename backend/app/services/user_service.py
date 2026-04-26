import uuid
from app.repositories.user_repository import pwd_context
from app.core.exceptions import BadRequestException, ConflictException, NotFoundException, UnprocessableEntityException
from app.repositories.user_repository import UserRepository

from app.DTOs.users import PasswordUpdate, PhoneUpdate

class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def get_by_id_without_password(self, id: str):
        user = await self.repository.get_by_id_without_password(id)

        if not user:
            raise NotFoundException("Usuário não encontrado.")
        
        return user

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

    async def update_password(self, user_id: uuid.UUID, data: PasswordUpdate):
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
        
        return updated_user
    
    async def update_phone(self, user_id: uuid.UUID, data: PhoneUpdate):
        updated_user = await self.repository.patch(user_id, data)
        if not updated_user:
            raise NotFoundException("Usuário não encontrado!")
        return updated_user

    async def delete_account(self, user_id: str):
        deleted_user = await self.repository.anonymize(user_id)
        if not deleted_user:
            raise NotFoundException("Usuário não encontrado!")
        return deleted_user

    async def list_students(self):
        return await self.repository.list_all_students()

    async def get_student_by_registration(self, registration_id: str):
        user = await self.repository.get_by_registration_id(registration_id)
        if not user:
            raise NotFoundException("Estudante não encontrado!")
        return user
    