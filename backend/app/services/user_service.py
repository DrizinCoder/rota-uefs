import uuid

from datetime import timedelta
from fastapi.responses import RedirectResponse
from app.repositories.user_repository import UserRepository
from app.DTOs.auth.dtos import RegisterAlunoDTO
from app.core.config import settings
from app.core.exceptions import  ConflictException
from app.services.auth_service import AuthService
from app.services.email.use_cases import EmailUseCases
from jose import JWTError, jwt

class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository
        self.auth_service = AuthService()
        self.email_use_cases = EmailUseCases()

    async def register_student(self, dados: RegisterAlunoDTO):
        existing = await self.repository.get_by_email(dados.email)
        if existing:
            raise ConflictException("Usuário já cadastrado")

        dados.registration_status = "PENDING" 
        user = await self.repository.create_student(dados)

        token = self.auth_service.create_access_token(
            data={
                "sub": str(user.user_id),
                "type": "account_activation"
            },
            expires_delta=timedelta(minutes=30)
        )

        base_url = "http://localhost:8000"

        link = f"{base_url}/auth/activate?token={token}"

        first_name = user.full_name.split()[0]

        self.email_use_cases.send_account_confirmation(
            email=user.email,
            first_name=first_name,
            link=link
        )

        return user
    
    async def activate_account(self, token: str):
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )

            user_id = payload.get("sub")
            token_type = payload.get("type")

            if token_type != "account_activation":
                return RedirectResponse(
                    url=f"{settings.BASE_URL_FRONTEND}/login?error=invalid_token"
                )

            user = await self.repository.get_by_id(uuid.UUID(user_id))

            if not user:
                return RedirectResponse(
                    url=f"{settings.BASE_URL_FRONTEND}/login?error=user_not_found"
                )

            user.registration_status = "ACTIVE"
            await self.repository.update(user)

            return RedirectResponse(
                url=f"{settings.BASE_URL_FRONTEND}/login?activated=true"
            )

        except JWTError:
            return RedirectResponse(
                url=f"{settings.BASE_URL_FRONTEND}/login?error=expired_or_invalid"
            )