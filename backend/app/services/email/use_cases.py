from .email_service import EmailService
from .template_service import TemplateService
from app.core.exceptions import InternalServerException


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
                message=f"Erro ao enviar confirmação: {str(e)}"
            )