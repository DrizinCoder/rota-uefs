from email.mime.image import MIMEImage
import base64
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
import logging

class EmailService:
    def __init__(self):
        self.server = settings.MAIL_SERVER
        self.port = settings.MAIL_PORT
        self.username = settings.MAIL_USERNAME
        self.password = settings.MAIL_PASSWORD
        self.from_email = settings.MAIL_FROM

    def _connect(self):
        # If credentials are not provided, use a dummy server that logs emails (dev mode)
        if not self.username or not self.password:
            logger = logging.getLogger(__name__)
            class DummyServer:
                def sendmail(self, from_addr, to_addrs, msg):
                    logger.info(f"[DEV EMAIL] sendmail from={from_addr} to={to_addrs}\n{msg[:200]}")
                def quit(self):
                    return None

            return DummyServer()

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

    def send_with_inline_image(
        self,
        subject: str,
        email_to: str,
        html_content: str,
        image_base64: str,
        image_cid: str,
    ):
        msg = MIMEMultipart("related")
        msg["Subject"] = subject
        msg["From"] = self.from_email
        msg["To"] = email_to

        msg_alternative = MIMEMultipart("alternative")
        msg.attach(msg_alternative)
        msg_alternative.attach(MIMEText(html_content, "html"))

        image_data = base64.b64decode(image_base64)
        image = MIMEImage(image_data, _subtype="png")
        image.add_header("Content-ID", f"<{image_cid}>")
        image.add_header("Content-Disposition", "inline", filename=f"{image_cid}.png")
        msg.attach(image)

        server = self._connect()
        server.sendmail(self.from_email, [email_to], msg.as_string())
        server.quit()