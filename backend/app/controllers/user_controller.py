import uuid
from datetime import timedelta
from jose import jwt, JWTError

from app.core.config import settings
from app.core.exceptions import ConflictException, BadRequestException, NotFoundException
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.services.email.use_cases import EmailUseCases

class UserController:
    def __init__(self, repository: UserRepository):
        self.repository = repository
        self.auth_service = AuthService()
        self.email_use_cases = EmailUseCases()

    async def request_email_change(self, user_id: uuid.UUID, new_email: str, base_url: str) -> dict:
        # 1. Verifica se o e-mail já não pertence a outro usuário
        existing_user = await self.repository.get_by_email(new_email)
        if existing_user:
            raise ConflictException("Este e-mail já está em uso por outro usuário.")

        # 2. Gera o Token de Segurança (JWT) válido por 30 minutos
        token_data = {
            "sub": str(user_id),
            "new_email": new_email,
            "type": "email_change"
        }
        
        token = self.auth_service.create_access_token(
            data=token_data, 
            expires_delta=timedelta(minutes=30)
        )

        # 3. Cria o link de confirmação que vai no botão do e-mail
        confirmation_link = f"{base_url}/confirm-email?token={token}"

        # 4. Envia o e-mail
        self.email_use_cases.send_email_change_confirmation(new_email, confirmation_link)

        return {"message": "E-mail de confirmação enviado com sucesso."}

    async def confirm_email_change(self, token: str) -> dict:
        try:
            # 1. Tenta abrir e ler o token secreto usando a chave do servidor
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id_str = payload.get("sub")
            new_email = payload.get("new_email")
            token_type = payload.get("type")

            if not user_id_str or not new_email or token_type != "email_change":
                raise BadRequestException("Token inválido para esta operação.")
            
            user_id = uuid.UUID(user_id_str)

        except JWTError:
            raise BadRequestException("Token inválido ou expirado.")

        # 2. Busca o usuário no banco de dados
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise NotFoundException("Usuário não encontrado.")

        # 3. Atualiza o e-mail usando o repositório
        user.email = new_email
        await self.repository.update(user)

        return {"message": "E-mail alterado com sucesso."}
