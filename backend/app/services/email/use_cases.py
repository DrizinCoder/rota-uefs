from app.utils.utils import generate_qr_code_base64
from app.utils.utils import generate_registration_code
import uuid
from .email_service import EmailService
from .template_service import TemplateService
from app.core.exceptions import InternalServerException
import logging

logger = logging.getLogger(__name__)


class EmailUseCases:
    def __init__(self):
        self.email_service = EmailService()
        self.template_service = TemplateService()

    def send_welcome(self, email: str, name: str, link: str):
        try:
            html = self.template_service.render(
                "welcome.html",
                {
                    "name": name,
                    "link": link
                }
            )

            self.email_service.send(
                subject="Bem-vindo ao Rota UEFS 🚍",
                email_to=email,
                html_content=html
            )

        except Exception as e:
            return InternalServerException(
                message=f"Erro ao enviar email: {str(e)}"
            )
        
    def send_recover_password(self, email: str, name: str, token: str):
        try:
            html = self.template_service.render(
                "recover_password.html",
                {
                    "name": name,
                    "link": f"https://rota-uefs/reset/password?token={token}"
                }
            )

            self.email_service.send(
                subject="Recuperação de Senha - Rota UEFS 🚍",
                email_to=email,
                html_content=html
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar email: {str(e)}"
            )

    def send_email_change_confirmation(self, email: str, link: str):
        try:
            html = self.template_service.render(
                "confirm_email_change.html",
                {"link": link}
            )
            self.email_service.send(
                subject="Confirme sua alteração de e-mail - Rota UEFS",
                email_to=email,
                html_content=html
            )
        except Exception as e:
            return InternalServerException(message=f"Erro ao enviar confirmação: {str(e)}")

    def send_account_confirmation(self, email: str, first_name: str, link: str):
        try:
            html = self.template_service.render(
                "account_confirmation.html",
                {
                    "link": link,
                    "first_name": first_name
                }
            )

            self.email_service.send(
                subject=f"{first_name}, ative sua conta no Rota UEFS",
                email_to=email,
                html_content=html
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar email de confirmação de conta: {str(e)}"
            )
        
    def send_boarding_qr_code(
        self,
        email: str,
        first_name: str,
        position: int,
        boarding_point: str,
        drop_off_point: str,
        trip_date: str,
        departure_time: str,
        reservation_id: uuid.UUID,
        trip_id: uuid.UUID,
        registration_id: str,
    ):
        try:
            code = generate_registration_code(reservation_id, trip_id, registration_id)
            qr_base64 = generate_qr_code_base64(code)

            html = self.template_service.render(
                "boarding_qr_code.html",
                {
                    "first_name": first_name,
                    "position": position,
                    "boarding_point": boarding_point,
                    "drop_off_point": drop_off_point,
                    "trip_date": trip_date,
                    "departure_time": departure_time,
                    "qr_code_base64": qr_base64,
                }
            )

            self.email_service.send_with_inline_image(
                subject="Seu QR Code de Embarque - Rota UEFS 🚍",
                email_to=email,
                html_content=html,
                image_base64=qr_base64,
                image_cid="boarding_qr_code",
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar email: {str(e)}"
            )