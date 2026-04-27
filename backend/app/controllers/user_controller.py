from datetime import timedelta
from app.services.email.use_cases import EmailUseCases
from app.services.auth_service import AuthService
import uuid
from app.services.user_service import UserService

class UserController:
    def __init__(self, user_service: UserService, auth_service: AuthService, email_use_cases: EmailUseCases):
        self.user_service = user_service
        self.auth_service = auth_service
        self.email_use_cases = email_use_cases

    async def request_email_change(self, user_id: uuid.UUID, new_email: str, base_url: str):
        await self.user_service.check_email_available(new_email)

        token = self.auth_service.create_access_token(
            data={"sub": str(user_id), "new_email": new_email, "type": "email_change"},
            expires_delta=timedelta(minutes=30)
        )

        confirmation_link = f"{base_url}/users/email-change/confirm?token={token}"
        self.email_use_cases.send_email_change_confirmation(new_email, confirmation_link)

        return {"message": "E-mail de confirmação enviado com sucesso."}

    async def confirm_email_change(self, token: str):
        payload = self.auth_service.decode_token(token)

        await self.user_service.update_email(payload["user_id"], payload["new_email"])

        return {"message": "E-mail alterado com sucesso."}