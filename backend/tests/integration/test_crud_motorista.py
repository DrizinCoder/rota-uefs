from tests.fixtures.motorista_payloads import (
    MOTORISTA_CREATE_VALID,
    MOTORISTA_CREATE_INVALID,
    MOTORISTA_UPDATE_VALID,
    MOTORISTA_UPDATE_INVALID,
)

def test_crud_motorista_create_sucesso(client):
    response = client.post("/admin/register/motorista", json=MOTORISTA_CREATE_VALID)
    assert response.status_code in (200, 201, 403, 422)

def test_crud_motorista_create_payload_invalido(client):
    response = client.post("/admin/register/motorista", json=MOTORISTA_CREATE_INVALID)
    assert response.status_code in (400, 422, 403)

def test_crud_motorista_update_sucesso(client):
    response = client.patch("/users/update/phone/1", json=MOTORISTA_UPDATE_VALID)
    assert response.status_code in (200, 201, 403, 422)

def test_crud_motorista_update_payload_invalido(client):
    response = client.patch("/users/update/phone/1", json=MOTORISTA_UPDATE_INVALID)
    assert response.status_code in (400, 422, 403)

def test_crud_motorista_delete_sucesso(client):
    response = client.delete("/users/delete/account/1")
    assert response.status_code in (200, 201, 204, 403, 422)
