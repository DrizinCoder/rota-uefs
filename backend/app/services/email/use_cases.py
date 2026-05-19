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
        
    def send_cancellation_confirmation_driver(self, email: str, name: str, trip_name: str):
        try:
            html = self.template_service.render(
                "cancellation_driver.html",
                {
                    "name": name.split(" ")[0],
                    "trip_name": trip_name
                }
            )
            self.email_service.send("Confirmação de cancelamento - Rota UEFS 🚍", email, html)
        except Exception as e:
            logger.error(f"Erro e-mail cancelamento motorista: {e}")

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

    def send_trip_cancelled(self, email: str, name: str, trip_name: str, trip_date: str):
        try:
            html = self.template_service.render(
                "trip_cancelled.html",
                {
                    "name": name.split(" ")[0],
                    "trip_name": trip_name,
                    "trip_date": trip_date
                }
            )

            self.email_service.send(
                subject="Viagem cancelada - Rota UEFS 🚍",
                email_to=email,
                html_content=html
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar email de cancelamento de viagem: {str(e)}"
            )

    def send_subscription_confirmation_staff(self, email: str, name: str, trip_name: str):
        try:
            html = self.template_service.render(
                "subscription_confirmation_staff.html",
                {
                    "name": name.split(" ")[0],
                    "trip_name": trip_name
                }
            )

            self.email_service.send(
                subject="Inscrição confirmada - Rota UEFS 🚍",
                email_to=email,
                html_content=html
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar notificação de lista de espera: {str(e)}"
            )
    
    def send_subscription_confirmation_staff_for_extra_name(self, email: str, name: str, trip_name: str, extra_name: str):
        try:
            html = self.template_service.render(
                "subscription_confirmation_staff_for_extra_name.html",
                {
                    "name": name.split(" ")[0],
                    "trip_name": trip_name,
                    "extra_name": extra_name
                }
            )

            self.email_service.send(
                subject="Inscrição confirmada - Rota UEFS 🚍",
                email_to=email,
                html_content=html
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar notificação de lista de espera: {str(e)}"
            )

    def send_subscription_confirmation_student(self, email: str, name: str, trip_name: str):
        try:
            html = self.template_service.render(
                "subscription_confirmation_student.html",
                {
                    "name": name,
                    "trip_name": trip_name
                }
            )

            self.email_service.send(
                subject="Inscrição confirmada - Rota UEFS 🚍",
                email_to=email,
                html_content=html
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar notificação de lista de espera: {str(e)}"
            )
        

    def send_reactivation_confirmation_staff(self, email: str, name: str, trip_name: str):
        try:
            html = self.template_service.render(
                "reactivation_staff.html",
                {"name": name.split(" ")[0], "trip_name": trip_name}
            )
            self.email_service.send("Reserva reativada - Rota UEFS 🚍", email, html)
        except Exception as e:
            logger.error(f"Erro e-mail reativação staff: {e}")

    def send_reactivation_confirmation_staff_for_extra_name(self, email: str, name: str, trip_name: str, extra_name: str):
        try:
            html = self.template_service.render(
                "reactivation_staff_extra.html",
                {"name": name.split(" ")[0], "trip_name": trip_name, "extra_name": extra_name}
            )
            self.email_service.send("Reserva de convidado reativada - Rota UEFS 🚍", email, html)
        except Exception as e:
            logger.error(f"Erro e-mail reativação extra: {e}")

    def send_reactivation_confirmation_student(self, email: str, name: str, trip_name: str):
        try:
            html = self.template_service.render(
                "reactivation_student.html",
                {"name": name.split(" ")[0], "trip_name": trip_name}
            )
            self.email_service.send("Sua reserva foi reativada - Rota UEFS 🚍", email, html)
        except Exception as e:
            logger.error(f"Erro e-mail reativação estudante: {e}")

    def send_cancellation_confirmation_staff(self, email: str, name: str, trip_name: str):
        try:
            html = self.template_service.render(
                "cancellation_staff.html",
                {"name": name.split(" ")[0], "trip_name": trip_name}
            )
            self.email_service.send("Reserva cancelada - Rota UEFS 🚍", email, html)
        except Exception as e:
            logger.error(f"Erro e-mail cancelamento staff: {e}")

    async def send_cancellation_confirmation_staff_for_extra_name(self, email: str, name: str, trip_name: str, extra_name: str):
        try:
            html = self.template_service.render(
                "cancellation_staff_extra.html",
                {"name": name.split(" ")[0], "trip_name": trip_name, "extra_name": extra_name}
            )
            self.email_service.send("Reserva de convidado cancelada - Rota UEFS 🚍", email, html)
        except Exception as e:
            logger.error(f"Erro e-mail cancelamento extra: {e}")
        
    async def send_cancellation_confirmation_student(self, email: str, name: str, trip_name: str):
        try:
            html = self.template_service.render(
                "cancellation_student.html",
                {"name": name.split(" ")[0], "trip_name": trip_name}
            )
            print(f"Enviando e-mail de cancelamento para estudante {name} email {email}")
            await self.email_service.send("Confirmação de cancelamento - Rota UEFS 🚍", email, html)
            print(f"E-mail de cancelamento enviado para estudante {name} email {email}")
        except Exception as e:
            logger.error(f"Erro e-mail cancelamento estudante: {e}")
        
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
