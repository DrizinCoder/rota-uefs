import base64
import logging
import resend
from app.core.config import settings

class EmailService:
    def __init__(self):
        resend.api_key = settings.RESEND_API_KEY 
        self.from_email = settings.MAIL_FROM

    def _connect(self):
        if not resend.api_key:
            logger = logging.getLogger(__name__)
            class DummyServer:
                def send_mock(self, from_addr, to_addr, subject):
                    logger.info(f"[EMAIL - RESEND] from={from_addr} to={to_addr} subject='{subject}'")
            
            return DummyServer()
            
        return None

    def send(self, subject: str, email_to: str, html_content: str):
        dev_server = self._connect()
        if dev_server:
            dev_server.send_mock(self.from_email, email_to, subject)
            return

        params = {
            "from": self.from_email,
            "to": email_to,
            "subject": subject,
            "html": html_content,
        }

        resend.Emails.send(params)

    def send_with_inline_image(
        self,
        subject: str,
        email_to: str,
        html_content: str,
        image_base64: str,
        image_cid: str,
    ):
        dev_server = self._connect()
        if dev_server:
            dev_server.send_mock(self.from_email, email_to, f"{subject} [IMG CID: {image_cid}]")
            return

        image_data = list(base64.b64decode(image_base64))

        params = {
            "from": self.from_email,
            "to": email_to,
            "subject": subject,
            "html": html_content,
            "attachments": [
                {
                    "filename": f"{image_cid}.png",
                    "content": image_data,
                    "content_id": image_cid
                }
            ]
        }

        resend.Emails.send(params)