import app.routers.test.routes as test_routes
from app.routers.users.dependencies import get_push_subscription_service


def test_enviar_push_sucesso(client, fake_push_subscription_service):
    client.app.dependency_overrides[get_push_subscription_service] = lambda: fake_push_subscription_service

    response = client.post("/tests/enviar-push")

    assert response.status_code == 200
    assert response.json()["success"] is True
    fake_push_subscription_service.send_to_user.assert_called_once_with(
        user_id="test-student-id",
        title="Notificação de Teste",
        body="Se você recebeu isso, as notificações estão funcionando!"
    )

    client.app.dependency_overrides.pop(get_push_subscription_service, None)


def test_enviar_email_sucesso(client, monkeypatch, fake_email_use_cases):
    monkeypatch.setattr(test_routes, "EmailUseCases", lambda: fake_email_use_cases)

    response = client.post("/tests/enviar-email", json={"target_email": "test@example.com"})

    assert response.status_code == 202
    assert response.json()["success"] is True
    assert fake_email_use_cases.send_welcome.call_count == 1
    fake_email_use_cases.send_welcome.assert_called_once_with(
        "test@example.com",
        "João",
        "https://rota-uefs.com/login"
    )
