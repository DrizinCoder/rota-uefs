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
            raise InternalServerException(
                message=f"Erro ao enviar email: {str(e)}"
            )
        
    def send_recover_password(self, email: str, name: str, token: str):
        try:
            html = self.template_service.render(
                "recover_password.html",
                {
                    "name": name,
                    "link": token
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