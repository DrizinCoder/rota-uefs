import base64
import datetime
import uuid
from app.utils.utils import add_ninety_minutes, generate_registration_code, generate_qr_code_base64


def test_utils_functions():
    sample_time = datetime.time(8, 0, 0)
    assert add_ninety_minutes(sample_time).hour == 9
    assert add_ninety_minutes(sample_time).minute == 30

    reservation_id = uuid.UUID('12345678-1234-5678-1234-567812345678')
    trip_id = uuid.UUID('87654321-4321-8765-4321-876543214321')
    code = generate_registration_code(reservation_id, trip_id, 'ABC123')

    assert isinstance(code, str)
    assert code.startswith(str(reservation_id) + '.')
    assert len(code) > len(str(reservation_id))

    qr = generate_qr_code_base64('test')
    assert isinstance(qr, str)
    assert len(qr) > 0

    decoded = base64.b64decode(qr)
    assert decoded.startswith(b'\x89PNG')
