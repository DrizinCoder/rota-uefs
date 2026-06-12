import os, sys, uuid
from pathlib import Path
from contextlib import asynccontextmanager
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

pytest_plugins = ["pytest_asyncio"]

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
os.environ.setdefault("SECRET_KEY", "test-secret")
os.environ.setdefault("MAIL_USERNAME", "test@example.com")
os.environ.setdefault("MAIL_PASSWORD", "password")
os.environ.setdefault("MAIL_FROM", "test@example.com")
os.environ.setdefault("BASE_URL_FRONTEND", "https://rota-uefs/test")
os.environ.setdefault("REFRESH_TOKEN_EXPIRE_DAYS", "30")
os.environ.setdefault("MISFIRE_GRACE_TIME", "30")
os.environ.setdefault("VAPID_PRIVATE_KEY", "test-private-key")
os.environ.setdefault("VAPID_PUBLIC_KEY", "test-public-key")
os.environ.setdefault("VAPID_CLAIMS_EMAIL", "test@example.com")

import pytest
from fastapi import HTTPException, Depends
from fastapi.testclient import TestClient

PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = PROJECT_ROOT / "backend"
TESTS_BACKEND_DIR = Path(__file__).resolve().parent

sys.path.insert(0, str(PROJECT_ROOT))
sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(TESTS_BACKEND_DIR))

from mocks.fake_test_helpers import (
    FakeDashboardController,
    FakePushSubscriptionService,
    FakeEmailUseCases,
    DummyBackgroundTasks,
    DummyUserRepo,
    DummyNotificationEmailUseCases,
)

from app.main import app
from app.database.db import get_session
from app.routers.admin.routes import get_admin_controller
from app.routers.auth.routes import get_auth_controller
from app.routers.users.student.route_student import get_user_service as get_student_service
from app.routers.users.dependencies import get_user_service as get_users_service
from app.middleware.auth_middleware import get_current_user, require_profile
from app.services.email.email_service import EmailService
from app.DTOs.auth import AlunoRegisterResponseDTO, ServidorRegisterResponseDTO
from app.middleware.auth_middleware import TokenData
from app.enums.enums import AccessLevel, UserProfile


@asynccontextmanager
async def fake_lifespan(app):
    yield


async def override_get_session():
    mock_session = MagicMock()
    mock_session.execute  = AsyncMock()
    mock_session.commit   = AsyncMock()
    mock_session.flush    = AsyncMock()
    mock_session.close    = AsyncMock()
    mock_session.add      = MagicMock()
    mock_session.rollback = AsyncMock()
    mock_session.refresh  = AsyncMock(side_effect=lambda obj: None)
    mock_result = MagicMock()
    mock_scalars = MagicMock()
    mock_session.execute.return_value = mock_result
    mock_result.scalars.return_value  = mock_scalars
    mock_scalars.first.return_value   = None
    mock_scalars.all.return_value     = []
    yield mock_session


class FakeAdminController:
    """Mantém estado real de admins criados para validação consistente em testes."""

    def __init__(self):
        self._admins = {}  # {admin_id: {full_name, email, registration_id, ...}}
        self._created_emails = set()
        self._created_ids = set()

    def _create_admin_response(self, admin_id, registration_id, email, full_name):
        """Cria resposta padronizada com dados reais do admin."""
        return {
            "admin_id": admin_id,
            "registration_id": registration_id,
            "email": email,
            "full_name": full_name,
            "access_level": AccessLevel.OPERATOR.value,
        }

    async def create(self, dados):
        rid = getattr(dados, "registration_id", None)
        email = getattr(dados, "email", None)
        
        if rid and rid in self._created_ids:
            raise HTTPException(status_code=409, detail="Registration ID já está em uso")
        if email and email in self._created_emails:
            raise HTTPException(status_code=409, detail="Email já está em uso")
        
        admin_id = str(uuid.uuid4())
        full_name = getattr(dados, "full_name", "Admin UEFS")
        
        self._admins[admin_id] = {
            "admin_id": admin_id,
            "registration_id": rid,
            "email": email,
            "full_name": full_name,
        }
        self._created_ids.add(rid)
        self._created_emails.add(email)
        
        return self._create_admin_response(admin_id, rid, email, full_name)

    async def list_all(self):
        return [self._create_admin_response(
            a["admin_id"], a["registration_id"], a["email"], a["full_name"]
        ) for a in self._admins.values()]

    async def get_by_id(self, admin_id):
        admin_id_str = str(admin_id)
        if admin_id_str not in self._admins:
            raise HTTPException(status_code=404, detail="Admin não encontrado")
        
        a = self._admins[admin_id_str]
        return self._create_admin_response(a["admin_id"], a["registration_id"], a["email"], a["full_name"])

    async def update(self, admin_id, update_data):
        admin_id_str = str(admin_id)
        if admin_id_str not in self._admins:
            raise HTTPException(status_code=404, detail="Admin não encontrado")
        
        # Atualizar dados reais do admin
        if hasattr(update_data, "full_name"):
            self._admins[admin_id_str]["full_name"] = update_data.full_name
        
        a = self._admins[admin_id_str]
        return self._create_admin_response(a["admin_id"], a["registration_id"], a["email"], a["full_name"])

    async def delete(self, admin_id):
        admin_id_str = str(admin_id)
        if admin_id_str not in self._admins:
            raise HTTPException(status_code=404, detail="Admin não encontrado")
        
        a = self._admins.pop(admin_id_str)
        if a["registration_id"]:
            self._created_ids.discard(a["registration_id"])
        if a["email"]:
            self._created_emails.discard(a["email"])
        
        return {"message": "deleted"}

    async def delete_account(self, user_id):
        user_id_str = str(user_id)
        if user_id_str not in self._admins:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        a = self._admins.pop(user_id_str)
        if a["registration_id"]:
            self._created_ids.discard(a["registration_id"])
        if a["email"]:
            self._created_emails.discard(a["email"])
        
        return {"message": "deleted"}

    async def get_home_info(self, today):
        return {}

    async def register_motorista(self, dados):
        return self._create_admin_response(str(uuid.uuid4()), "MOT001", "motor@uefs.br", "Motorista")

    async def list_drivers(self):
        return []

    async def list_staff_pending(self):
        return []

    async def update_status_staff(self, *args, **kwargs):
        return {"message": "updated"}


class FakeAuthController:
    """Mock AuthController para testes de autenticação e registro"""

    def __init__(self, user_service=None):
        self._user_service = user_service
        self._created_emails = set()
        self._created_registrations = set()

    async def register_student(self, dados, background_tasks):
        email = getattr(dados, "email", None) or getattr(dados, "e_mail", None)
        registration_id = getattr(dados, "registration_id", None) or getattr(dados, "matricula", None)
        full_name = getattr(dados, "full_name", None) or getattr(dados, "name", "Estudante")
        password = getattr(dados, "password", None) or getattr(dados, "senha", None)
        phone = getattr(dados, "phone", None) or getattr(dados, "telefone", None)
        
        if email and email in self._created_emails:
            raise HTTPException(status_code=409, detail="Email já está em uso")
        if registration_id and registration_id in self._created_registrations:
            raise HTTPException(status_code=409, detail="Registration ID já está em uso")
        
        if email:
            self._created_emails.add(email)
        if registration_id:
            self._created_registrations.add(registration_id)
        
        student_id = str(uuid.uuid4())
        
        if self._user_service:
            self._user_service.add_student(
                student_id,
                full_name=full_name,
                email=email,
                registration_id=registration_id,
                password=password,
                phone=phone
            )
        
        return AlunoRegisterResponseDTO(
            user_id=uuid.UUID(student_id),
            full_name=full_name,
            email=email,
            registration_id=registration_id
        )

    async def register_staff(self, dados, background_tasks=None):
        email = getattr(dados, "email", None)
        if email and email in self._created_emails:
            raise HTTPException(status_code=409, detail="Email já está em uso")
        if email:
            self._created_emails.add(email)

        return ServidorRegisterResponseDTO.model_validate({
            "user_id": uuid.UUID(str(uuid.uuid4())),
            "full_name": getattr(dados, "full_name", "Servidor"),
            "registration_id": getattr(dados, "registration_id", None),
            "email": email,
            "staff_member": {
                "department": getattr(dados, "department", "TI"),
                "employment_type": getattr(dados, "employment", "efetivo"),
            },
        })

    async def login(self, dados):
        return {
            "access_token": "fake-token",
            "refresh_token": "fake-refresh-token",
            "token_type": "bearer",
        }

    async def recover_password(self, email: str):
        return {"message": "Email enviado"}

    async def reset_password(self, token: str, new_password: str):
        return {"message": "Senha resetada"}

    async def activate_account(self, token: str):
        return {"message": "Conta ativada"}


class FakeUserService:
    """Mock UserService para testes de operações de usuários"""

    def __init__(self):
        self._students = {}

    async def list_students(self):
        return list(self._students.values())

    async def get_student_by_registration(self, registration_id: str):
        for student in self._students.values():
            if student.get("registration_id") == registration_id:
                return student
        raise HTTPException(status_code=404, detail="Estudante não encontrado")

    async def get_student_by_id(self, user_id):
        user_id_str = str(user_id)
        if user_id_str in self._students:
            student = self._students[user_id_str].copy()
            student.pop("password", None)
            return student
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    async def get_by_id_without_password(self, user_id):
        user_id_str = str(user_id)
        if user_id_str in self._students:
            user = self._students[user_id_str].copy()
            user.pop("password", None)
            return user
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    async def delete_account(self, user_id):
        user_id_str = str(user_id)
        if user_id_str in self._students:
            del self._students[user_id_str]
        return {"message": "Conta deletada"}

    async def update_phone(self, user_id, data):
        user_id_str = str(user_id)
        if user_id_str not in self._students:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        # Se receber um DTO, extrair o phone
        phone = data.phone if hasattr(data, "phone") else data
        self._students[user_id_str]["phone"] = phone
        return self._students[user_id_str]

    async def update_password(self, user_id, data):
        user_id_str = str(user_id)
        if user_id_str not in self._students:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        # data é um PasswordUpdate DTO
        if hasattr(data, "password") and hasattr(data, "confirm_password"):
            if data.password != data.confirm_password:
                raise HTTPException(status_code=400, detail="Senhas não coincidem")
            self._students[user_id_str]["password"] = data.password
        return {"message": "Senha atualizada"}

    def add_student(self, user_id: str, **data):
        data["user_id"] = user_id
        self._students[user_id] = data


class CurrentUserContext:
    """Contexto compartilhado para sincronizar usuário autenticado entre fixture e mocks."""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.current_user = None
        return cls._instance
    
    def set_user(self, user_data: dict):
        """Define o usuário autenticado atual."""
        self.current_user = user_data
    
    def get_token_data(self) -> TokenData:
        """Retorna TokenData do usuário autenticado."""
        if not self.current_user:
            # Padrão para testes que não criam usuário
            return TokenData(
                sub="test-student-id",
                registration_id="test-registration",
                email="test@example.com",
                profile=UserProfile.STUDENT,
                full_name="Test Student",
                access_level=None
            )
        
        return TokenData(
            sub=self.current_user.get("user_id", "test-student-id"),
            registration_id=self.current_user.get("registration_id", "test-registration"),
            email=self.current_user.get("email", "test@example.com"),
            profile=self.current_user.get("profile", UserProfile.STUDENT),
            full_name=self.current_user.get("full_name", "Test Student"),
            access_level=self.current_user.get("access_level", None)
        )
    
    def clear(self):
        """Limpar contexto."""
        self.current_user = None


async def mock_get_current_user() -> TokenData:
    """Mock para get_current_user - retorna contexto dinâmico do usuário autenticado."""
    ctx = CurrentUserContext()
    return ctx.get_token_data()


def mock_require_profile(*profiles):
    """Mock para require_profile - permite qualquer perfil."""
    async def _mock_require_profile(current_user: TokenData = Depends(mock_get_current_user)) -> TokenData:
        return current_user
    return _mock_require_profile


@pytest.fixture
def fake_dashboard_controller():
    return FakeDashboardController()


@pytest.fixture
def fake_push_subscription_service():
    return FakePushSubscriptionService()


@pytest.fixture
def fake_email_use_cases():
    return FakeEmailUseCases()


@pytest.fixture
def dummy_notification_email_use_cases():
    return DummyNotificationEmailUseCases()


@pytest.fixture
def dummy_background_tasks():
    return DummyBackgroundTasks()


@pytest.fixture
def dummy_user_repo():
    return DummyUserRepo()


@pytest.fixture
def fake_email_service():
    """Mock EmailService para evitar envio real de emails"""
    mock_service = MagicMock(spec=EmailService)
    mock_service.send_account_confirmation = AsyncMock()
    mock_service.send_password_recovery = AsyncMock()
    mock_service.send_email = AsyncMock()
    return mock_service


@pytest.fixture
def client(fake_email_service):
    admin_controller = FakeAdminController()
    user_service = FakeUserService()
    auth_controller = FakeAuthController(user_service=user_service)
    
    app.dependency_overrides[get_session]          = override_get_session
    app.dependency_overrides[get_admin_controller] = lambda: admin_controller
    app.dependency_overrides[get_auth_controller]  = lambda: auth_controller
    app.dependency_overrides[get_student_service]  = lambda: user_service
    app.dependency_overrides[get_users_service]    = lambda: user_service
    app.dependency_overrides[get_current_user]     = mock_get_current_user
    app.dependency_overrides[require_profile]      = mock_require_profile
    app.dependency_overrides[EmailService]         = lambda: fake_email_service
    
    original_lifespan = app.router.lifespan_context
    app.router.lifespan_context = fake_lifespan
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.router.lifespan_context = original_lifespan
        app.dependency_overrides.clear()


@pytest.fixture
def auth_student_client(client, created_estudante):
    """Cliente autenticado como o estudante criado."""
    # Sincronizar o contexto de autenticação com o estudante criado
    ctx = CurrentUserContext()
    ctx.set_user({
        "user_id": created_estudante["user_id"],
        "registration_id": created_estudante["registration_id"],
        "email": created_estudante["email"],
        "profile": UserProfile.STUDENT,
        "full_name": "Created Student",
    })
    
    client.headers.update({"Authorization": "Bearer fake-token-estudante"})
    yield client
    
    # Limpar contexto após teste
    ctx.clear()


@pytest.fixture
def created_admin(client):
    """Fixture que retorna um admin criado com seu ID"""
    from fixtures.admin_payloads import ADMIN_CREATE_VALID
    
    response = client.post("/admin/", json=ADMIN_CREATE_VALID)
    assert response.status_code == 201
    admin_id = response.json()["data"]["admin_id"]
    
    return {
        "admin_id": admin_id,
        "email": ADMIN_CREATE_VALID["email"],
        "response": response
    }


@pytest.fixture
def created_estudante(client):
    """Fixture que retorna um estudante criado com seu ID"""
    from fixtures.estudante_payloads import ESTUDANTE_CREATE_VALID
    
    response = client.post("/auth/register/student", json=ESTUDANTE_CREATE_VALID)
    assert response.status_code == 201
    student_data = response.json()["data"]
    
    return {
        "user_id": student_data["user_id"],
        "registration_id": student_data["registration_id"],
        "email": ESTUDANTE_CREATE_VALID["email"],
        "response": response
    }