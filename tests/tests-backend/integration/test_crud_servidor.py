from fixtures.servidor_payloads import (
    SERVIDOR_CREATE_VALID,
    SERVIDOR_CREATE_INVALID,
    SERVIDOR_UPDATE_VALID,
    SERVIDOR_UPDATE_INVALID,
)

def test_crud_servidor_create_sucesso(client):
    response = client.post("/auth/register/staff", json=SERVIDOR_CREATE_VALID)
    assert response.status_code == 201

    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert "email" in data["data"]

def test_crud_servidor_create_payload_invalido(client):
    response = client.post("/auth/register/staff", json=SERVIDOR_CREATE_INVALID)
    assert response.status_code == 422

def test_crud_servidor_update_sucesso(client, created_estudante):
    user_id = created_estudante["user_id"]
    response = client.patch(f"/users/update/phone/{user_id}", json=SERVIDOR_UPDATE_VALID)
    assert response.status_code == 200
    assert response.json()["success"] is True

def test_crud_servidor_update_payload_invalido(client, created_estudante):
    user_id = created_estudante["user_id"]
    response = client.patch(f"/users/update/phone/{user_id}", json=SERVIDOR_UPDATE_INVALID)
    assert response.status_code == 422

def test_crud_servidor_delete_sucesso(client):
    response = client.delete("/users/delete/account/me")
    assert response.status_code == 204
