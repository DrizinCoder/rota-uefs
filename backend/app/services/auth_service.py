from app.DTOs.auth import RegisterServidorDTO
from datetime import datetime, timedelta, timezone
from typing import Optional
import uuid
from fastapi import BackgroundTasks
from fastapi.responses import RedirectResponse
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.models.models import User
from app.enums.enums import RegistrationStatus, UserProfile
from app.repositories.user_repository import UserRepository
from app.services.email.use_cases import EmailUseCases
from app.DTOs.auth import RegisterAlunoDTO
from app.core.exceptions import ConflictException, NotFoundException, UnauthorizedException
import logging

logger = logging.getLogger(__name__)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self, repository: UserRepository):
        self.repository = repository
        self.email_use_cases = EmailUseCases()
        
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.SECRET_KEY, 
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt

    @staticmethod
    def create_refresh_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    def create_token_for_user(user: User) -> dict:
        token_data = {
            "sub": str(user.user_id),
            "registration_id": user.registration_id,
            "email": user.email,
            "profile": user.profile.value,
            "full_name": user.full_name
        }
        
        if user.profile == UserProfile.ADMIN and user.admin_member:
            token_data["access_level"] = user.admin_member.access_level.value
        
        elif user.profile == UserProfile.DRIVER:
            token_data["driver_id"] = str(user.user_id)
        
        elif user.profile == UserProfile.STAFF:
            token_data["staff_id"] = str(user.user_id)
            if user.staff_member:
                token_data["department"] = user.staff_member.department
                token_data["employment_type"] = user.staff_member.employment_type.value
        
        elif user.profile == UserProfile.STUDENT:
            token_data["student_id"] = str(user.user_id)
        
        access_token = AuthService.create_access_token(token_data)
        refresh_token = AuthService.create_refresh_token({"sub": str(user.user_id)})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                
                "sub": str(user.user_id),
                "full_name": user.full_name,
                "registration_id": user.registration_id,
                "email": user.email,
                "profile": user.profile.value,
                "registration_status": user.registration_status.value
            }
        }
    
    @staticmethod
    def create_token_recovery_password(user: User) -> dict:
        token_data = {
            "sub": str(user.user_id),
            "email": user.email
        }
        
        access_token = AuthService.create_access_token(token_data, expires_delta=timedelta(minutes=15))

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": token_data
        }
    
    async def register_student(self, dados: RegisterAlunoDTO, background_tasks: BackgroundTasks,):
        logger.info(f"Student registration requested | Email: {dados.email}")

        existing = await self.repository.get_by_email(dados.email)
        if existing:
            raise ConflictException("Usuário já cadastrado")

        dados.registration_status = "PENDING" 
        user = await self.repository.create_student(dados)

        token = AuthService.create_access_token(
            data={
                "sub": str(user.user_id),
                "type": "account_activation"
            },
            expires_delta=timedelta(minutes=30)
        )

        base_url = settings.BASE_URL_FRONTEND

        link = f"{base_url}/activate/account?token={token}"

        first_name = user.full_name.split()[0]

        background_tasks.add_task(
            self.email_use_cases.send_account_confirmation,
            email=user.email,
            first_name=first_name,
            link=link)  

        logger.info(f"Student registered successfully | User ID: {user.user_id}")
        return user
    
    async def register_staff(self, dados: RegisterServidorDTO):
        logger.info(f"Staff registration requested | Email: {dados.email}")

        existing = await self.repository.get_by_email(dados.email)
        if existing:
            raise ConflictException("Usuário já cadastrado")
        
        user = await self.repository.create_staff(dados)

        logger.info(f"Staff registered successfully | User ID: {user.user_id}")
        return user

    async def activate_account(self, token: str):
        logger.info("Account activation requested")

        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )

            user_id = payload.get("sub")
            token_type = payload.get("type")

            if token_type != "account_activation":
                raise UnauthorizedException("Token inválido para ativação.")

            user = await self.repository.get_by_id(uuid.UUID(user_id))

            if not user:
                raise NotFoundException("Usuário não encontrado.")

            if user.registration_status != RegistrationStatus.ACTIVE:
                user.registration_status = RegistrationStatus.ACTIVE
                await self.repository.update(user)

            logger.info(f"Account activated successfully | User ID: {user_id}")
            return self.create_token_for_user(user)

        except JWTError:
            raise UnauthorizedException("Sessão de ativação expirada.")
