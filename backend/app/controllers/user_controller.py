from datetime import timedelta
from app.services.email.use_cases import EmailUseCases
from app.services.auth_service import AuthService
import uuid
from app.services.user_service import UserService
import logging

logger = logging.getLogger(__name__)


class UserController:
    def __init__(self, user_service: UserService, auth_service: AuthService, email_use_cases: EmailUseCases):
        self.user_service = user_service
        self.auth_service = auth_service
        self.email_use_cases = email_use_cases

    async def request_email_change(self, user_id: uuid.UUID, new_email: str, base_url: str):
        logger.info(f"Email change requested | User: {user_id} | New: {new_email}")

        await self.user_service.check_email_available(new_email)

        token = self.auth_service.create_access_token(
            data={"sub": str(user_id), "new_email": new_email, "type": "email_change"},
            expires_delta=timedelta(minutes=30)
        )

        confirmation_link = f"{base_url}/users/email-change/confirm?token={token}"
        try:
            self.email_use_cases.send_email_change_confirmation(new_email, confirmation_link)
            logger.info(f"Confirmation email sent | Target: {new_email}")
        except Exception as e:
            logger.error(f"Email delivery failed | Target: {new_email} | Error: {str(e)}")
            raise e

        return {"message": "E-mail de confirmação enviado com sucesso."}

    async def confirm_email_change(self, token: str):
        payload = self.auth_service.decode_token(token)
        user_id = payload.get("sub")
        new_email = payload.get("new_email")

        logger.info(f"Confirming email change | User: {user_id}")

        await self.user_service.update_email(user_id, new_email)

        logger.info(f"Email updated successfully | User: {user_id} | New: {new_email}")

        return {"message": "E-mail alterado com sucesso."}