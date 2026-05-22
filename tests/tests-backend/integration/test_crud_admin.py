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

    def test_create_admin_sucesso(self, client):
        response = client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert response.status_code == 201
        data = response.json()
        assert "data" in data
        assert "admin_id" in data["data"]
        assert data["data"].get("email") == ADMIN_CREATE_VALID["email"]

    def test_create_admin_payload_invalido_retorna_422(self, client):
        response = client.post("/admin/", json=ADMIN_CREATE_INVALID)
        assert response.status_code == 422

    def test_list_all_admins_sucesso(self, client):
        response = client.get("/admin/")
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert isinstance(data["data"], list)

    def test_get_admin_by_id_existente(self, client):
        create_resp = client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert create_resp.status_code == 201
        admin_id = create_resp.json()["data"]["admin_id"]

        response = client.get(f"/admin/{admin_id}")
        assert response.status_code == 200
        inner = response.json().get("data", response.json())
        assert inner.get("admin_id") == admin_id

    def test_get_admin_by_id_inexistente_retorna_404(self, client):
        response = client.get(f"/admin/{uuid.uuid4()}")
        assert response.status_code == 404

    def test_get_admin_by_id_uuid_invalido_retorna_422(self, client):
        response = client.get("/admin/invalid-uuid")
        assert response.status_code == 422

    def test_update_admin_sucesso(self, client):
        create_resp = client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert create_resp.status_code == 201
        admin_id = create_resp.json()["data"]["admin_id"]

        response = client.patch(f"/admin/{admin_id}", json=ADMIN_UPDATE_VALID)
        assert response.status_code == 200

    def test_update_admin_inexistente_retorna_404(self, client):
        response = client.patch(f"/admin/{uuid.uuid4()}", json=ADMIN_UPDATE_VALID)
        assert response.status_code == 404

    def test_delete_admin_sucesso(self, client):
        create_resp = client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert create_resp.status_code == 201
        admin_id = create_resp.json()["data"]["admin_id"]

        response = client.delete(f"/admin/{admin_id}")
        assert response.status_code in (200, 204)

    def test_delete_admin_inexistente_retorna_404(self, client):
        response = client.delete(f"/admin/{uuid.uuid4()}")
        assert response.status_code == 404

    def test_delete_admin_account_sucesso(self, client):
        create_resp = client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert create_resp.status_code == 201
        admin_id = create_resp.json()["data"]["admin_id"]

        response = client.delete(f"/admin/delete/account/{admin_id}")
        assert response.status_code in (200, 204)


class TestAdminValidacoes:

    @pytest.mark.parametrize("field, value", [
        ("email",     "email_invalido"),
        ("full_name", ""),
    ])
    def test_create_admin_campos_invalidos_retorna_422(self, client, field, value):
        payload = ADMIN_CREATE_VALID.copy()
        payload[field] = value
        response = client.post("/admin/", json=payload)
        assert response.status_code == 422

    def test_update_admin_dados_parciais_sucesso(self, client):
        create_resp = client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert create_resp.status_code == 201
        admin_id = create_resp.json()["data"]["admin_id"]

        response = client.patch(f"/admin/{admin_id}", json={"full_name": "Novo Nome"})
        assert response.status_code == 200


class TestAdminErrosNegocio:

    def test_create_admin_matricula_duplicada_retorna_409(self, client):
        resp1 = client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert resp1.status_code == 201

        resp2 = client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert resp2.status_code == 409

    def test_create_admin_email_duplicado_retorna_409(self, client):
        resp1 = client.post("/admin/", json=ADMIN_CREATE_VALID)
        assert resp1.status_code == 201

        payload = ADMIN_CREATE_VALID.copy()
        payload["registration_id"] = "ADM0002"
        resp2 = client.post("/admin/", json=payload)
        assert resp2.status_code == 409