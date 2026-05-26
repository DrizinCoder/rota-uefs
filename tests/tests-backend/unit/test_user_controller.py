import uuid

import pytest
from types import SimpleNamespace
from app.controllers.user_controller import UserController


class DummyUserService:
    def __init__(self):
        self.updated = None

    async def check_email_available(self, new_email):
        return True

    async def update_email(self, user_id, new_email):
        self.updated = (user_id, new_email)


class DummyAuthService:
    def create_access_token(self, data, expires_delta=None):
        return "fake-token"

    def decode_token(self, token):
        return {"sub": str(self.user_id), "new_email": "new@example.com"}


class DummyEmailUseCases:
    def __init__(self):
        self.sent = []

    def send_email_change_confirmation(self, email, link):
        self.sent.append((email, link))


@pytest.mark.asyncio
async def test_user_controller_request_email_change_and_confirm():
    user_id = uuid.uuid4()
    user_service = DummyUserService()
    auth_service = DummyAuthService()
    auth_service.user_id = user_id
    email_use_cases = DummyEmailUseCases()

    controller = UserController(user_service, auth_service, email_use_cases)
    response = await controller.request_email_change(user_id, "new@example.com", "https://example.com")

    assert response == {"message": "E-mail de confirmação enviado com sucesso."}
    assert len(email_use_cases.sent) == 1
    assert email_use_cases.sent[0][0] == "new@example.com"

    result = await controller.confirm_email_change("fake-token")
    assert result == {"message": "E-mail alterado com sucesso."}
    assert user_service.updated == (str(user_id), "new@example.com")
