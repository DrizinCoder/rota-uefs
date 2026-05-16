from app.utils.utils import add_ninety_minutes, generate_registration_code, generate_qr_code_base64
import uuid
import datetime


def test_utils_functions():
    sample_time = datetime.time(8, 0, 0)
    assert add_ninety_minutes(sample_time).hour == 9
    code = generate_registration_code(uuid.uuid4(), uuid.uuid4(), 'ABC123')
    assert '.' in code
    qr = generate_qr_code_base64('test')
    assert isinstance(qr, str)
    assert len(qr) > 0
