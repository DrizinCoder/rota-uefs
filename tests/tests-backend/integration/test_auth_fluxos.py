from fixtures.auth_payloads import (
    REGISTER_USER_VALID,
    REGISTER_USER_INVALID,
    LOGIN_VALID,
    LOGIN_INVALID,
)

def test_auth_registro_motorista_sucesso(client):
    response = client.post("/admin/register/motorista", json=REGISTER_USER_VALID)
    assert response.status_code == 201

    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "email" in data["data"]
    assert "registration_id" in data["data"]

def test_auth_registro_motorista_payload_invalido(client):
    response = client.post("/admin/register/motorista", json=REGISTER_USER_INVALID)
    assert response.status_code == 422

def test_auth_login_sucesso(client):
    response = client.post("/auth/login", json=LOGIN_VALID)
    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["token_type"] == "bearer"

def test_auth_login_payload_invalido(client):
    response = client.post("/auth/login", json=LOGIN_INVALID)
    assert response.status_code == 422
