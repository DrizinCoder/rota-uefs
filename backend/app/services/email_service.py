from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from app.core.config import settings

class EmailService:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_USERNAME=settings.MAIL_USERNAME,
            MAIL_PASSWORD=settings.MAIL_PASSWORD,
            MAIL_FROM=settings.MAIL_FROM,
            MAIL_PORT=settings.MAIL_PORT,
            MAIL_SERVER=settings.MAIL_SERVER,
            MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
            MAIL_STARTTLS=settings.MAIL_STARTTLS,
            MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
            USE_CREDENTIALS=settings.USE_CREDENTIALS,
            VALIDATE_CERTS=settings.VALIDATE_CERTS
        )
        self.fastmail = FastMail(self.conf)

    async def send_html_email(self, subject: str, email_to: str, html_content: str):
        message = MessageSchema(
            subject=subject,
            recipients=[email_to],
            body=html_content,
            subtype=MessageType.html
        )
        await self.fastmail.send_message(message)

    # FUNÇÃO PARA TESTES
    async def send_simple_email(self, subject: str, email_to: str, body: str):
        message = MessageSchema(
            subject=subject,
            recipients=[email_to],
            body=body,
            subtype=MessageType.plain
        )
        await self.fastmail.send_message(message)