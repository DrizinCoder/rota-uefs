import uuid
from app.DTOs.auth.dtos import LoginUserDTO
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.core.exceptions import UnauthorizedException, NotFoundException
from app.enums.enums import RegistrationStatus


class AuthController:
    def __init__(self, repository: UserRepository):
        self.repository = repository
        self.auth_service = AuthService()

    async def login(self, dados: LoginUserDTO) -> dict:
        user = await self.repository.get_by_registration(dados.matricula)
        
        if not user:
            raise NotFoundException("Usuário não encontrado")
        
        if user.registration_status == RegistrationStatus.BLOCKED:
            raise UnauthorizedException("Usuário bloqueado. Entre em contato com o administrador.")
        
        if user.registration_status == RegistrationStatus.PENDING:
            raise UnauthorizedException("Cadastro pendente de aprovação.")
        
        if not self.auth_service.verify_password(dados.senha, user.password):
            raise UnauthorizedException("Credenciais inválidas")
        
        token_data = self.auth_service.create_token_for_user(user)
        
        return token_data
    
    async def recover_password(self, email: str) -> dict:
        user = await self.repository.get_by_email(email)
        
        if not user:
            raise NotFoundException("Usuário não encontrado")
        
        if user.registration_status == RegistrationStatus.BLOCKED:
            raise UnauthorizedException("Usuário bloqueado. Entre em contato com o administrador.")
        
        if user.registration_status == RegistrationStatus.PENDING:
            raise UnauthorizedException("Cadastro pendente de aprovação.")
        
        token_data = self.auth_service.create_token_recovery_password(user)
        
        #enviar email

        return token_data["user"]