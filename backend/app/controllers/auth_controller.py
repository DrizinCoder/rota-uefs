from jose import jwt
from app.core.config import settings
from app.DTOs.auth.dtos import AlunoRegisterResponseDTO, LoginUserDTO, ResetPasswordDTO
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.core.exceptions import ForbiddenException, UnauthorizedException, NotFoundException
from app.enums.enums import RegistrationStatus
from app.services.email.use_cases import EmailUseCases
from fastapi import BackgroundTasks


class AuthController:
    def __init__(self, repository: UserRepository):
        self.repository = repository
        self.auth_service = AuthService()

    async def register_student(self, dados, background_tasks):
        user = await self.auth_service.register_student(dados, background_tasks)
        return AlunoRegisterResponseDTO.model_validate(user)

    async def activate_account(self, token: str):
        return await self.auth_service.activate_account(token)

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
        
        token_data = self.auth_service.create_token_recovery_password(user)

        #enviar email      
        BackgroundTasks().add_task(EmailUseCases().send_recover_password,
            email, 
            user.full_name, 
            token_data["access_token"]
        )

        return token_data
    
    async def reset_password(self, token: str, data: ResetPasswordDTO) -> None:
        
        try:
            jwt_data = jwt.decode(token, settings.SECRET_KEY) # No processo de decode já é realizada a validação.
            user = await self.repository.get_by_id(jwt_data["sub"])
        
        except Exception as e:
            raise UnauthorizedException("Token invalidado: Sessão expirou")
        
        if not user:
            raise NotFoundException("Usuário não encontrado")
        
        if user.user_id != data.user_id:
            raise UnauthorizedException("Usário inesperado")
        
        if data.password != data.password_confirmation:
            raise ForbiddenException("Valor diferente de senhas")
        
        user.password = data.password
        await self.repository.update(user)

        return
