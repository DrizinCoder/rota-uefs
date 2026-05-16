from app.services.email.use_cases import EmailUseCases


def test_email_use_cases_methods():
    assert hasattr(EmailUseCases, 'send_welcome')
    assert hasattr(EmailUseCases, 'send_email_change_confirmation')
