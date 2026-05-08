import time
from datetime import datetime, timedelta
import uuid
import hmac
import hashlib

from app.core.config import settings

def add_ninety_minutes(t: time) -> time:
    dummy = datetime(2000, 1, 1, t.hour, t.minute, t.second)
    return (dummy + timedelta(minutes=90)).time()

def generate_registration_code(
    reservation_id: uuid.UUID,
    trip_id: uuid.UUID,
    registration_id: str,
) -> str:
    secret = settings.REGISTRATION_CODE_SECRET.encode()
    message = f"{reservation_id}:{trip_id}:{registration_id}".encode()
    digest = hmac.new(secret, message, hashlib.sha256).hexdigest()
    return f"{reservation_id}.{digest}"