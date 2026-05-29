import pytest

from fixtures.auth_payloads import LOGIN_VALID, RECOVER_PASSWORD_VALID
from fixtures.estudante_payloads import ESTUDANTE_UPDATE_PASSWORD_VALID, ESTUDANTE_UPDATE_PASSWORD_INVALID


def test_auth_recover_password_sucesso(client):
    response = client.post(
        "/auth/recover/password",
        params={"email": RECOVER_PASSWORD_VALID["email"]}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["message"] == "Email enviado"


def test_auth_activate_account_sucesso(client):
    response = client.post(
        "/auth/activate/account/student",
        params={"token": "dummy-token"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["message"] == "Conta ativada"


def test_auth_reset_password_no_content(auth_student_client, created_estudante):
    payload = {
        "user_id": created_estudante["user_id"],
        "password": ESTUDANTE_UPDATE_PASSWORD_VALID["password"],
        "password_confirmation": ESTUDANTE_UPDATE_PASSWORD_VALID["confirm_password"],
    }

    response = auth_student_client.post(
        "/auth/reset/password",
        params={"token": "dummy-token"},
        json=payload,
    )

    assert response.status_code == 204


def test_auth_login_set_cookies(client):
    response = client.post("/auth/login", json=LOGIN_VALID)

    assert response.status_code == 200
    assert response.cookies.get("access_token") is not None
    assert response.cookies.get("refresh_token") is not None


def test_users_me_returns_user_data(auth_student_client, created_estudante):
    response = auth_student_client.get("/users/me")

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert data["data"]["registration_id"] == created_estudante["registration_id"]


def test_update_password_sucesso(auth_student_client, created_estudante):
    student_id = created_estudante["user_id"]
    payload = {
        "password": ESTUDANTE_UPDATE_PASSWORD_VALID["password"],
        "confirm_password": ESTUDANTE_UPDATE_PASSWORD_VALID["confirm_password"],
    }

    response = auth_student_client.patch(f"/users/update/password/{student_id}", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


def test_update_password_mismatch_retorna_400(auth_student_client, created_estudante):
    student_id = created_estudante["user_id"]
    payload = {
        "password": ESTUDANTE_UPDATE_PASSWORD_INVALID["password"],
        "confirm_password": ESTUDANTE_UPDATE_PASSWORD_INVALID["confirm_password"],
    }

    response = auth_student_client.patch(f"/users/update/password/{student_id}", json=payload)

    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "HTTP_ERROR"
