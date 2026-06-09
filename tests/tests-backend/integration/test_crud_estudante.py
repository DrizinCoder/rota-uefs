"""
Testes de integração para CRUD de Estudante
Cobre operações de criação, leitura, atualização e deleção de estudantes
com asserções fortes de status code e estrutura de resposta.
"""

import uuid

import pytest
from fixtures.estudante_payloads import (
    ESTUDANTE_CREATE_VALID,
    ESTUDANTE_CREATE_INVALID,
    ESTUDANTE_UPDATE_PHONE_VALID,
    ESTUDANTE_UPDATE_PHONE_INVALID,
    ESTUDANTE_UPDATE_PASSWORD_VALID,
    ESTUDANTE_UPDATE_PASSWORD_INVALID,
)


class TestEstudanteCRUD:
    """Testes para operações CRUD de estudante"""

    def test_create_estudante_sucesso(self, client):
        """Cria estudante com dados válidos e retorna 201"""
        response = client.post("/auth/register/student", json=ESTUDANTE_CREATE_VALID)

        assert response.status_code == 201
        data = response.json()
        assert "data" in data
        assert data["data"].get("registration_id") == ESTUDANTE_CREATE_VALID["registration_id"]

    def test_create_estudante_payload_invalido_retorna_422(self, client):
        """Criação com payload inválido deve retornar 422"""
        response = client.post("/auth/register/student", json=ESTUDANTE_CREATE_INVALID)

        assert response.status_code == 422

    def test_list_all_estudantes_sucesso(self, client):
        """Listagem de todos os estudantes retorna 200 e uma lista"""
        response = client.get("/users/student/")

        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert isinstance(data["data"], list)

    def test_get_estudante_por_matricula_existente(self, client):
        """Cria estudante e obtém por matrícula com 200"""
        create_resp = client.post("/auth/register/student", json=ESTUDANTE_CREATE_VALID)
        assert create_resp.status_code == 201
        registration_id = ESTUDANTE_CREATE_VALID["registration_id"]

        response = client.get(f"/users/student/matricula/{registration_id}/")

        assert response.status_code == 200
        data = response.json()
        assert data.get("data", {}).get("registration_id") == registration_id

    def test_get_estudante_por_matricula_inexistente_retorna_404(self, client):
        """Matrícula inexistente deve retornar 404"""
        fake_registration = f"EST{uuid.uuid4().hex[:6]}"

        response = client.get(f"/users/student/matricula/{fake_registration}/")

        assert response.status_code == 404

    def test_update_phone_estudante_existente_retorna_200(self, client):
        """Atualiza telefone de estudante existente com 200"""
        create_resp = client.post("/auth/register/student", json=ESTUDANTE_CREATE_VALID)
        assert create_resp.status_code == 201
        student_id = create_resp.json()["data"]["user_id"]

        response = client.patch(
            f"/users/update/phone/{student_id}", json=ESTUDANTE_UPDATE_PHONE_VALID
        )

        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["success"] == True

    def test_update_phone_estudante_invalido_retorna_422(self, client):
        """Telefone em formato inválido deve retornar 422"""
        create_resp = client.post("/auth/register/student", json=ESTUDANTE_CREATE_VALID)
        assert create_resp.status_code == 201
        student_id = create_resp.json()["data"]["user_id"]

        response = client.patch(
            f"/users/update/phone/{student_id}", json=ESTUDANTE_UPDATE_PHONE_INVALID
        )

        assert response.status_code == 422

    def test_update_phone_estudante_inexistente_retorna_404(self, client):
        """Atualização de telefone de estudante inexistente deve retornar 404"""
        fake_id = str(uuid.uuid4())

        response = client.patch(
            f"/users/update/phone/{fake_id}", json=ESTUDANTE_UPDATE_PHONE_VALID
        )

        assert response.status_code == 404

    def test_update_password_estudante_sucesso(self, client):
        """Atualiza senha de estudante existente com 200"""
        create_resp = client.post("/auth/register/student", json=ESTUDANTE_CREATE_VALID)
        assert create_resp.status_code == 201
        student_id = create_resp.json()["data"]["user_id"]

        response = client.patch(
            f"/users/update/password/{student_id}",
            json=ESTUDANTE_UPDATE_PASSWORD_VALID,
        )

        assert response.status_code == 200

    def test_update_password_estudante_senhas_nao_coincidem_retorna_400(self, client):
        """Senhas que não coincidem devem retornar 400"""
        create_resp = client.post("/auth/register/student", json=ESTUDANTE_CREATE_VALID)
        assert create_resp.status_code == 201
        student_id = create_resp.json()["data"]["user_id"]

        response = client.patch(
            f"/users/update/password/{student_id}",
            json=ESTUDANTE_UPDATE_PASSWORD_INVALID,
        )

        assert response.status_code == 400

    def test_update_password_estudante_inexistente_retorna_404(self, client):
        """Atualização de senha de estudante inexistente deve retornar 404"""
        fake_id = str(uuid.uuid4())

        response = client.patch(
            f"/users/update/password/{fake_id}",
            json=ESTUDANTE_UPDATE_PASSWORD_VALID,
        )

        assert response.status_code == 404

    def test_delete_estudante_account_sucesso(self, client, auth_student_client):
        """
        Exclusão de conta de estudante logado.
        Aqui assumo que exista um fixture auth_student_client autenticado como o estudante.
        """
        response = auth_student_client.delete("/users/delete/account/me")

        assert response.status_code in (200, 204)


class TestEstudanteValidacoes:
    """Testes de validação de dados do CRUD de estudante"""

    @pytest.mark.parametrize(
        "field, value",
        [
            ("email", "email_invalido"),
            ("password", ""),
            ("registration_id", ""),
            ("full_name", ""),
        ],
    )
    def test_create_estudante_validacao_campos_obrigatorios(
        self, client, field, value
    ):
        """Validação de campos obrigatórios na criação"""
        payload = ESTUDANTE_CREATE_VALID.copy()
        payload[field] = value

        response = client.post("/auth/register/student", json=payload)

        assert response.status_code == 422

    def test_create_estudante_email_invalido_retorna_422(self, client):
        """Email inválido deve retornar 422"""
        invalid_payload = ESTUDANTE_CREATE_INVALID.copy()
        invalid_payload["email"] = "not_an_email"

        response = client.post("/auth/register/student", json=invalid_payload)

        assert response.status_code == 422

    def test_create_estudante_password_muito_fraca_retorna_422(self, client):
        """Senha muito fraca deve retornar 422"""
        weak_payload = ESTUDANTE_CREATE_VALID.copy()
        weak_payload["password"] = "123"

        response = client.post("/auth/register/student", json=weak_payload)

        assert response.status_code == 422


class TestEstudanteErrosNegocio:
    """Testes de erros de negócio para operações de estudante"""

    def test_create_estudante_matricula_duplicada_retorna_409(self, client):
        """Criação com matrícula duplicada deve retornar 409"""
        response1 = client.post("/auth/register/student", json=ESTUDANTE_CREATE_VALID)
        assert response1.status_code == 201

        response2 = client.post("/auth/register/student", json=ESTUDANTE_CREATE_VALID)
        assert response2.status_code == 409

    def test_create_estudante_email_duplicado_retorna_409(self, client):
        """Criação com email duplicado deve retornar 409"""
        response1 = client.post("/auth/register/student", json=ESTUDANTE_CREATE_VALID)
        assert response1.status_code == 201

        duplicate_payload = ESTUDANTE_CREATE_VALID.copy()

        response2 = client.post("/auth/register/student", json=duplicate_payload)
        assert response2.status_code == 409


class TestEstudanteCRUDFluxoCompleto:
    """Testes de fluxo completo de CRUD de estudante"""

    def test_criar_e_listar_estudante(self, client):
        """Fluxo completo: criar estudante e depois listar"""
        create_resp = client.post("/auth/register/student", json=ESTUDANTE_CREATE_VALID)
        assert create_resp.status_code == 201
        created_id = create_resp.json()["data"]["registration_id"]

        list_resp = client.get("/users/student/")
        assert list_resp.status_code == 200

        data = list_resp.json()
        assert "data" in data
        assert isinstance(data["data"], list)
