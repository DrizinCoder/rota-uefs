from app.DTOs.auth import ServidorRegisterResponseDTO
from app.core.exceptions import ConflictException
from app.DTOs.auth import RegisterServidorDTO
from jose import JWTError, jwt
from app.core.config import settings
from app.DTOs.auth import AlunoRegisterResponseDTO, LoginUserDTO, ResetPasswordDTO
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository
from app.core.exceptions import ForbiddenException, UnauthorizedException, NotFoundException
from app.enums.enums import RegistrationStatus
from app.services.email.use_cases import EmailUseCases
from fastapi import BackgroundTasks
import logging

logger = logging.getLogger(__name__)


class AuthController:
    def __init__(self, repository: UserRepository):
        self.repository = repository
        self.auth_service = AuthService(repository)

    async def register_student(self, dados, background_tasks):
        logger.info(f"Student registration requested | Email: {dados.email}")

        user = await self.auth_service.register_student(dados, background_tasks)

        logger.info(f"Student registered successfully | User ID: {user.user_id}")
        return AlunoRegisterResponseDTO.model_validate(user)

    async def activate_account(self, token: str):
        logger.info("Account activation requested")

        result = await self.auth_service.activate_account(token)

        logger.info("Account activated successfully")
        return result

    async def login(self, data: LoginUserDTO) -> dict:
        logger.info(f"Login requested | Registration: {data.registration_id}")

        user = await self.repository.get_by_registration(data.registration_id)
        
        if not user:
            raise NotFoundException("Usuário não encontrado")
        
        if user.registration_status == RegistrationStatus.BLOCKED:
            raise UnauthorizedException("Usuário bloqueado. Entre em contato com o administrador.")
        
        if user.registration_status == RegistrationStatus.PENDING:
            raise UnauthorizedException("Cadastro pendente de aprovação.")
        
        if not self.auth_service.verify_password(data.password, user.password):
            raise UnauthorizedException("Credenciais inválidas")
        
        token_data = self.auth_service.create_token_for_user(user)

        logger.info(f"Login successful | User ID: {user.user_id}")
        return token_data
    
    async def recover_password(self, email: str) -> dict:
        logger.info(f"Password recovery requested | Email: {email}")

        user = await self.repository.get_by_email(email)
        
        if not user:
            raise NotFoundException("Usuário não encontrado")
        
        if user.registration_status == RegistrationStatus.BLOCKED:
            raise UnauthorizedException("Usuário bloqueado. Entre em contato com o administrador.")
        
        token_data = self.auth_service.create_token_recovery_password(user)
          
        BackgroundTasks().add_task(EmailUseCases().send_recover_password,
            email, 
            user.full_name, 
            token_data["access_token"]
        )

        logger.info(f"Password recovery email sent successfully | Email: {email}")
        return token_data
    
    async def reset_password(self, token: str, data: ResetPasswordDTO) -> None:
        logger.info(f"Password reset requested | User ID: {data.user_id}")

        try:
            jwt_data = jwt.decode(token, settings.SECRET_KEY) 
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

        logger.info(f"Password reset successfully | User ID: {data.user_id}")
        return

    async def register_staff(self, dados: RegisterServidorDTO):
        logger.info(f"Staff registration requested | Email: {dados.email}")

        staff = await self.auth_service.register_staff(dados)

        logger.info(f"Staff registered successfully | User ID: {staff.user_id}")
        return ServidorRegisterResponseDTO.model_validate(staff)


    async def refresh_session(self, refresh_token: str):
        logger.info("Session refresh requested")

        try:
            payload = self.token_service.decode_token(refresh_token)
            
            if payload.get("type") != "refresh":
                raise UnauthorizedException("Token inválido para refresh")

            user_id = payload.get("sub")
            user = await self.user_service.get_by_id(user_id)
            
            if not user or not user.is_active:
                raise UnauthorizedException("Usuário inválido ou inativo")

            new_access_token = self.token_service.create_access_token({"sub": str(user.id)})
            new_refresh_token = self.token_service.create_refresh_token({"sub": str(user.id)})

            logger.info(f"Session refreshed successfully | User ID: {user_id}")
            return {
                "access_token": new_access_token,
                "refresh_token": new_refresh_token,
                "user": user
            }

        except JWTError:
            raise UnauthorizedException("Sessão expirada. Faça login novamente.")