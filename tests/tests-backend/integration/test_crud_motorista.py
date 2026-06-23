from fixtures.motorista_payloads import (
    MOTORISTA_CREATE_VALID,
    MOTORISTA_CREATE_INVALID,
    MOTORISTA_UPDATE_VALID,
    MOTORISTA_UPDATE_INVALID,
)

def test_crud_motorista_create_sucesso(auth_admin_client):
    response = auth_admin_client.post("/admin/register/motorista", json=MOTORISTA_CREATE_VALID)
    assert response.status_code == 201

    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "email" in data["data"]

def test_crud_motorista_create_payload_invalido(auth_admin_client):
    response = auth_admin_client.post("/admin/register/motorista", json=MOTORISTA_CREATE_INVALID)
    assert response.status_code == 422

def test_crud_motorista_update_sucesso(client, created_estudante):
    user_id = created_estudante["user_id"]
    response = client.patch(f"/users/update/phone/{user_id}", json=MOTORISTA_UPDATE_VALID)
    assert response.status_code == 200
    assert response.json()["success"] is True

def test_crud_motorista_update_payload_invalido(client, created_estudante):
    user_id = created_estudante["user_id"]
    response = client.patch(f"/users/update/phone/{user_id}", json=MOTORISTA_UPDATE_INVALID)
    assert response.status_code == 422

def test_crud_motorista_delete_sucesso(auth_admin_client):
    response = auth_admin_client.delete("/users/delete/account/me")
    assert response.status_code == 204
