from app.DTOs.email import RequestEmailChangeDTO
from app.services.email.use_cases import EmailUseCases


def test_email_module_import():
    assert RequestEmailChangeDTO.__name__ == 'RequestEmailChangeDTO'
    assert hasattr(EmailUseCases, 'send_welcome')
    assert hasattr(EmailUseCases, 'send_recover_password')
