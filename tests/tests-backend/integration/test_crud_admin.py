"""
Testes de integração para CRUD de Administrador
"""
import uuid
import pytest
from fixtures.admin_payloads import (
    ADMIN_CREATE_VALID,
    ADMIN_CREATE_INVALID,
    ADMIN_UPDATE_VALID,
)


class TestAdminCRUD:

    def test_create_admin_sucesso(self, auth_admin_client):
        response = auth_admin_client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert response.status_code == 201
        data = response.json()
        assert "data" in data
        assert "admin_id" in data["data"]
        assert data["data"].get("email") == ADMIN_CREATE_VALID["email"]

    def test_create_admin_payload_invalido_retorna_422(self, auth_admin_client):
        response = auth_admin_client.post("/admin/", json=ADMIN_CREATE_INVALID)
        assert response.status_code == 422

    def test_list_all_admins_sucesso(self, auth_admin_client):
        response = auth_admin_client.get("/admin/")
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert isinstance(data["data"], list)

    def test_get_admin_by_id_existente(self, auth_admin_client):
        create_resp = auth_admin_client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert create_resp.status_code == 201
        admin_id = create_resp.json()["data"]["admin_id"]

        response = auth_admin_client.get(f"/admin/{admin_id}")
        assert response.status_code == 200
        inner = response.json().get("data", response.json())
        assert inner.get("admin_id") == admin_id

    def test_get_admin_by_id_inexistente_retorna_404(self, auth_admin_client):
        response = auth_admin_client.get(f"/admin/{uuid.uuid4()}")
        assert response.status_code == 404

    def test_get_admin_by_id_uuid_invalido_retorna_422(self, auth_admin_client):
        response = auth_admin_client.get("/admin/invalid-uuid")
        assert response.status_code == 422

    def test_update_admin_sucesso(self, auth_admin_client):
        create_resp = auth_admin_client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert create_resp.status_code == 201
        admin_id = create_resp.json()["data"]["admin_id"]

        response = auth_admin_client.patch(f"/admin/{admin_id}", json=ADMIN_UPDATE_VALID)
        assert response.status_code == 200

    def test_update_admin_inexistente_retorna_404(self, auth_admin_client):
        response = auth_admin_client.patch(f"/admin/{uuid.uuid4()}", json=ADMIN_UPDATE_VALID)
        assert response.status_code == 404

    def test_delete_admin_sucesso(self, auth_admin_client):
        create_resp = auth_admin_client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert create_resp.status_code == 201
        admin_id = create_resp.json()["data"]["admin_id"]

        response = auth_admin_client.delete(f"/admin/{admin_id}")
        assert response.status_code == 200
        assert response.json()["success"] is True

    def test_delete_admin_inexistente_retorna_404(self, auth_admin_client):
        response = auth_admin_client.delete(f"/admin/{uuid.uuid4()}")
        assert response.status_code == 404

    def test_delete_admin_account_sucesso(self, auth_admin_client):
        create_resp = auth_admin_client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert create_resp.status_code == 201
        admin_id = create_resp.json()["data"]["admin_id"]

        response = auth_admin_client.delete(f"/admin/delete/account/{admin_id}")
        assert response.status_code == 200
        assert response.json()["success"] is True


class TestAdminValidacoes:

    @pytest.mark.parametrize("field, value", [
        ("email",     "email_invalido"),
        ("full_name", ""),
    ])
    def test_create_admin_campos_invalidos_retorna_422(self, auth_admin_client, field, value):
        payload = ADMIN_CREATE_VALID.copy()
        payload[field] = value
        response = auth_admin_client.post("/admin/", json=payload)
        assert response.status_code == 422

    def test_update_admin_dados_parciais_sucesso(self, auth_admin_client):
        create_resp = auth_admin_client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert create_resp.status_code == 201
        admin_id = create_resp.json()["data"]["admin_id"]

        response = auth_admin_client.patch(f"/admin/{admin_id}", json={"full_name": "Novo Nome"})
        assert response.status_code == 200


class TestAdminErrosNegocio:

    def test_create_admin_matricula_duplicada_retorna_409(self, auth_admin_client):
        resp1 = auth_admin_client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert resp1.status_code == 201

        resp2 = auth_admin_client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert resp2.status_code == 409

    def test_create_admin_email_duplicado_retorna_409(self, auth_admin_client):
        resp1 = auth_admin_client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert resp1.status_code == 201

        payload = ADMIN_CREATE_VALID.copy()
        payload["registration_id"] = "ADM0002"
        resp2 = auth_admin_client.post("/admin/", json=payload)
        assert resp2.status_code == 409