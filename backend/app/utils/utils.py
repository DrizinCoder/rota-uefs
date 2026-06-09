import time
from datetime import datetime, timedelta
import uuid
import hmac
import hashlib
import qrcode
import base64
from io import BytesIO
from qrcode.image.pil import PilImage

from app.core.config import settings

def add_ninety_minutes(t: time) -> time:
    dummy = datetime(2000, 1, 1, t.hour, t.minute, t.second)
    return (dummy + timedelta(minutes=90)).time()

def generate_unique_id() -> str:
    return str(uuid.uuid4())

def generate_registration_code(
    reservation_id: uuid.UUID,
    trip_id: uuid.UUID,
    registration_id: str,
) -> str:
    secret = settings.REGISTRATION_CODE_SECRET.encode()
    message = f"{reservation_id}:{trip_id}:{registration_id}".encode()
    digest = hmac.new(secret, message, hashlib.sha256).hexdigest()
    return f"{reservation_id}.{digest}"

def generate_qr_code_base64(data: str) -> str:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(image_factory=PilImage, fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    return base64.b64encode(buffer.getvalue()).decode("utf-8")