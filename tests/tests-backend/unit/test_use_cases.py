from unittest.mock import patch
import pytest
from app.services.email.use_cases import EmailUseCases
from app.core.exceptions import InternalServerException


def test_email_use_cases_send_welcome_calls_template_and_mail_service():
    with patch('app.services.email.use_cases.TemplateService') as mock_template_service, patch('app.services.email.use_cases.EmailService') as mock_email_service:
        mock_template_service.return_value.render.return_value = '<html>Welcome</html>'
        use_cases = EmailUseCases()

        use_cases.send_welcome('user@example.com', 'User', 'https://example.com')

        mock_template_service.return_value.render.assert_called_once()
        mock_email_service.return_value.send.assert_called_once()


def test_send_recover_password_raises_internal_server_exception_when_template_fails():
    with patch('app.services.email.use_cases.EmailService'), patch('app.services.email.use_cases.TemplateService') as mock_template_service:
        mock_template_service.return_value.render.side_effect = Exception('render failed')
        use_cases = EmailUseCases()

        with pytest.raises(InternalServerException):
            use_cases.send_recover_password('user@example.com', 'User', 'token123')
