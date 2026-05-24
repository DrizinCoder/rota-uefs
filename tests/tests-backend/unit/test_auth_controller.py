import uuid

import pytest
from types import SimpleNamespace
from jose import jwt

from app.controllers.auth_controller import AuthController
from app.core.config import settings
from app.core.exceptions import NotFoundException
from app.enums.enums import RegistrationStatus
from app.DTOs.auth import LoginUserDTO, ResetPasswordDTO


class DummyRepository:
    def __init__(self, user=None):
        self.user = user
        self.updated = False

    async def get_by_registration(self, registration_id):
        return self.user if self.user and self.user.registration_id == registration_id else None

    async def get_by_email(self, email):
        return self.user if self.user and self.user.email == email else None

    async def get_by_id(self, user_id):
        return self.user if self.user and str(self.user.user_id) == str(user_id) else None

    async def update(self, user):
        self.updated = True
        self.user = user


class DummyAuthService:
    async def register_student(self, dados, background_tasks):
        return SimpleNamespace(
            user_id=uuid.uuid4(),
            full_name=dados.full_name,
            registration_id=dados.registration_id,
            email=dados.email,
        )

    async def register_staff(self, dados):
        return SimpleNamespace(
            user_id=uuid.uuid4(),
            full_name=dados.full_name,
            registration_id=dados.registration_id,
            email=dados.email,
            staff_member=SimpleNamespace(
                department=dados.department,
                employment_type=dados.employment,
            ),
        )

    def verify_password(self, plain, hashed):
        return plain == hashed

    def create_token_for_user(self, user):
        return {"access_token": "token", "token_type": "bearer"}

    def create_token_recovery_password(self, user):
        return {"access_token": "recovery-token", "token_type": "bearer"}


@pytest.mark.asyncio
async def test_register_student_returns_aluno_response():
    repo = DummyRepository()
    controller = AuthController(repo)
    controller.auth_service = DummyAuthService()

    payload = SimpleNamespace(
        full_name="Test Student",
        registration_id="24123456",
        phone="123456789",
        email="24123456@discente.uefs.br",
        password="secret123",
        profile="Student",
    )

    result = await controller.register_student(payload, background_tasks=SimpleNamespace())

    assert hasattr(result, "user_id")
    assert result.email == payload.email
    assert result.registration_id == payload.registration_id


@pytest.mark.asyncio
async def test_login_success_returns_access_token():
    user = SimpleNamespace(
        user_id=uuid.uuid4(),
        registration_id="24123456",
        password="secret123",
        registration_status=RegistrationStatus.ACTIVE,
    )
    repo = DummyRepository(user)
    controller = AuthController(repo)
    controller.auth_service = DummyAuthService()

    result = await controller.login(LoginUserDTO(registration_id="24123456", password="secret123"))

    assert result["access_token"] == "token"
    assert result["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_not_found_raises_not_found():
    repo = DummyRepository(None)
    controller = AuthController(repo)
    controller.auth_service = DummyAuthService()

    with pytest.raises(NotFoundException):
        await controller.login(LoginUserDTO(registration_id="00000000", password="secret123"))


@pytest.mark.asyncio
async def test_recover_password_returns_recovery_token(monkeypatch):
    user = SimpleNamespace(
        user_id=uuid.uuid4(),
        email="24123456@discente.uefs.br",
        full_name="Test Student",
        registration_status=RegistrationStatus.ACTIVE,
    )
    repo = DummyRepository(user)
    controller = AuthController(repo)
    controller.auth_service = DummyAuthService()

    result = await controller.recover_password(user.email)

    assert result["access_token"] == "recovery-token"
    assert result["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_reset_password_updates_password():
    user_id = uuid.uuid4()
    user = SimpleNamespace(
        user_id=user_id,
        password="oldpass",
    )
    repo = DummyRepository(user)
    controller = AuthController(repo)
    controller.auth_service = DummyAuthService()

    token = jwt.encode({"sub": str(user_id)}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    data = ResetPasswordDTO(
        user_id=user_id,
        password="newpassword",
        password_confirmation="newpassword",
    )

    await controller.reset_password(token, data)

    assert repo.updated is True
    assert repo.user.password == "newpassword"


@pytest.mark.asyncio
async def test_register_staff_returns_servidor_response():
    repo = DummyRepository()
    controller = AuthController(repo)
    controller.auth_service = DummyAuthService()

    payload = SimpleNamespace(
        full_name="Test Staff",
        registration_id="SRV1234",
        phone="123456789",
        email="staff@example.com",
        department="TI",
        employment="Professor",
    )

    result = await controller.register_staff(payload)

    assert hasattr(result, "user_id")
    assert result.email == payload.email
    assert result.department == payload.department
    assert result.employment == payload.employment
