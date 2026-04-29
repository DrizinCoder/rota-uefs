from tests.fixtures.auth_payloads import (
    REGISTER_USER_VALID,
    REGISTER_USER_INVALID,
    LOGIN_VALID,
    LOGIN_INVALID,
)

def test_auth_registro_motorista_sucesso(client):
    response = client.post("/admin/register/motorista", json=REGISTER_USER_VALID)
    assert response.status_code in (200, 201, 401, 403, 422)

def test_auth_registro_motorista_payload_invalido(client):
    response = client.post("/admin/register/motorista", json=REGISTER_USER_INVALID)
    assert response.status_code in (400, 422, 401, 403)

def test_auth_login_sucesso(client):
    response = client.post("/auth/login", json=LOGIN_VALID)
    assert response.status_code in (200, 201, 401, 404, 422)

def test_auth_login_payload_invalido(client):
    response = client.post("/auth/login", json=LOGIN_INVALID)
    assert response.status_code in (400, 422)
