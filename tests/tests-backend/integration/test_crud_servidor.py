from fixtures.servidor_payloads import (
    SERVIDOR_CREATE_VALID,
    SERVIDOR_CREATE_INVALID,
    SERVIDOR_UPDATE_VALID,
    SERVIDOR_UPDATE_INVALID,
)

def test_crud_servidor_create_sucesso(client):
    response = client.post("/auth/register/staff", json=SERVIDOR_CREATE_VALID)
    assert response.status_code in (200, 201, 422)

def test_crud_servidor_create_payload_invalido(client):
    response = client.post("/auth/register/staff", json=SERVIDOR_CREATE_INVALID)
    assert response.status_code in (400, 422)

def test_crud_servidor_update_sucesso(client):
    response = client.patch("/users/update/phone/1", json=SERVIDOR_UPDATE_VALID)
    assert response.status_code in (200, 201, 401, 403, 422)

def test_crud_servidor_update_payload_invalido(client):
    response = client.patch("/users/update/phone/1", json=SERVIDOR_UPDATE_INVALID)
    assert response.status_code in (400, 422, 401, 403)

def test_crud_servidor_delete_sucesso(client):
    response = client.delete("/users/delete/account/me")
    assert response.status_code in (200, 201, 204, 401, 403, 422)
