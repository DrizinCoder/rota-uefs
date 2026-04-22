import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

class EmailService:
    def __init__(self):
        self.server = settings.MAIL_SERVER
        self.port = settings.MAIL_PORT
        self.username = settings.MAIL_USERNAME
        self.password = settings.MAIL_PASSWORD
        self.from_email = settings.MAIL_FROM

    def _connect(self):
        server = smtplib.SMTP(self.server, self.port)
        server.starttls()
        server.login(self.username, self.password)
        return server

    def send(self, subject: str, email_to: str, html_content: str):
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.from_email
        msg["To"] = email_to

        msg.attach(MIMEText(html_content, "html"))

        server = self._connect()
        server.sendmail(self.from_email, [email_to], msg.as_string())
        server.quit()