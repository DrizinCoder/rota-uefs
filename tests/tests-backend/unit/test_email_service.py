import base64
from unittest.mock import MagicMock

from app.services.email.email_service import EmailService
from app.services.email.use_cases import EmailUseCases


def test_email_service_send_uses_resend_api(monkeypatch):
    monkeypatch.setattr('app.services.email.email_service.resend.api_key', 'test_key')
    mock_send = MagicMock()
    monkeypatch.setattr('app.services.email.email_service.resend.Emails.send', mock_send)

    service = EmailService()
    service.send(subject='Teste', email_to='user@test.com', html_content='<p>Ok</p>')

    mock_send.assert_called_once()
    called_args = mock_send.call_args.args[0]
    assert called_args['from'] == service.from_email
    assert called_args['to'] == 'user@test.com'
    assert called_args['subject'] == 'Teste'
    assert called_args['html'] == '<p>Ok</p>'


def test_email_service_send_with_inline_image_uses_resend_api(monkeypatch):
    monkeypatch.setattr('app.services.email.email_service.resend.api_key', 'test_key')
    mock_send = MagicMock()
    monkeypatch.setattr('app.services.email.email_service.resend.Emails.send', mock_send)

    service = EmailService()

    valid_png_base64 = base64.b64encode(
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0cIDAT\x08\xd7c\xf8\x0f\x00\x01\x01\x01\x00\x18\xdd\x8d\xf7\x00\x00\x00\x00IEND\xaeB`\x82'
    ).decode('ascii')

    service.send_with_inline_image(
        subject='Teste',
        email_to='user@test.com',
        html_content='<p><img src="cid:test"></p>',
        image_base64=valid_png_base64,
        image_cid='test'
    )

    mock_send.assert_called_once()
    called_args = mock_send.call_args.args[0]
    assert called_args['from'] == service.from_email
    assert called_args['to'] == 'user@test.com'
    assert called_args['subject'] == 'Teste'
    assert called_args['html'] == '<p><img src="cid:test"></p>'
    
    assert len(called_args['attachments']) == 1
    attachment = called_args['attachments'][0]
    assert attachment['filename'] == 'test.png'
    assert attachment['content_id'] == 'test'
    assert isinstance(attachment['content'], list)


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
    assert email_service.send.call_args.kwargs['email_to'] == 'user@test.com'
    assert email_service.send.call_args.kwargs['html_content'] == '<html>Bem-vindo</html>'
