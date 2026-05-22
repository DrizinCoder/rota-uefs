from unittest.mock import MagicMock

from app.services.email.email_service import EmailService
from app.services.email.use_cases import EmailUseCases


def test_email_service_send_uses_smtp_connection(monkeypatch):
    service = EmailService()
    fake_server = MagicMock()
    fake_server.sendmail.return_value = True

    monkeypatch.setattr(service, '_connect', lambda: fake_server)

    service.send(subject='Teste', email_to='user@test.com', html_content='<p>Ok</p>')

    fake_server.sendmail.assert_called_once()


def test_email_use_cases_send_welcome_calls_render_and_send(monkeypatch):
    use_cases = EmailUseCases()
    template = MagicMock()
    template.render.return_value = '<html>Bem-vindo</html>'
    monkeypatch.setattr(use_cases, 'template_service', template)
    email_service = MagicMock()
    monkeypatch.setattr(use_cases, 'email_service', email_service)

    use_cases.send_welcome(email='user@test.com', name='User', link='http://link')

    template.render.assert_called_once()
    email_service.send.assert_called_once()
