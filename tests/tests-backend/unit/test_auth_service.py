import asyncio
from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from jose import JWTError, jwt

from app.core.config import settings
from app.core.exceptions import ConflictException, NotFoundException, UnauthorizedException
from app.enums.enums import UserProfile, RegistrationStatus
from app.services.auth_service import AuthService


def make_user(profile=UserProfile.STUDENT):
    user = SimpleNamespace(
        user_id='00000000-0000-0000-0000-000000000000',
        registration_id='20240001',
        email='user@test.com',
        full_name='User Test',
        profile=profile,
        registration_status=RegistrationStatus.PENDING,
        admin_member=None,
    )
    return user


def test_verify_password_matches_hash(monkeypatch):
    monkeypatch.setattr('app.services.auth_service.pwd_context.verify', lambda plain, hashed: True)

    assert AuthService.verify_password('secret123', 'hashed_password') is True


def test_create_refresh_token_includes_refresh_type():
    token = AuthService.create_refresh_token({'sub': '00000000-0000-0000-0000-000000000000'})
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

    assert payload['sub'] == '00000000-0000-0000-0000-000000000000'
    assert payload['type'] == 'refresh'


def test_create_token_for_user_returns_user_payload():
    admin_user = make_user(profile=UserProfile.ADMIN)
    admin_user.registration_status = RegistrationStatus.ACTIVE
    admin_user.admin_member = SimpleNamespace(access_level=SimpleNamespace(value='MASTER'))

    tokens = AuthService.create_token_for_user(admin_user)

    assert 'access_token' in tokens
    assert 'refresh_token' in tokens
    assert tokens['user']['email'] == admin_user.email
    assert tokens['user']['registration_id'] == admin_user.registration_id


def test_register_student_raises_conflict_when_email_exists():
    repository = AsyncMock()
    repository.get_by_email.return_value = SimpleNamespace()
    service = AuthService(repository)

    with pytest.raises(ConflictException):
        asyncio.run(service.register_student(SimpleNamespace(email='exists@test.com', password='abc123', full_name='User'), MagicMock()))


def test_activate_account_updates_user_and_creates_token():
    repository = AsyncMock()
    user = make_user()
    user.registration_status = RegistrationStatus.PENDING
    repository.get_by_id.return_value = user
    repository.update.return_value = user
    service = AuthService(repository)

    token = AuthService.create_access_token({'sub': user.user_id, 'type': 'account_activation'}, expires_delta=timedelta(minutes=15))
    result = asyncio.run(service.activate_account(token))

    assert 'access_token' in result
    assert result['user']['email'] == user.email


def test_activate_account_raises_unauthorized_for_invalid_token():
    service = AuthService(AsyncMock())

    with pytest.raises(UnauthorizedException):
        asyncio.run(service.activate_account('invalid.token'))
