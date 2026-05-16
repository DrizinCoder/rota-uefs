import pytest
from jose import jwt
from fastapi.security import HTTPAuthorizationCredentials
from types import SimpleNamespace

from app.middleware.auth_middleware import get_current_user, require_admin, require_driver, require_staff, require_student, TokenData
from app.core.config import settings
from app.core.exceptions import UnauthorizedException
from app.enums.enums import UserProfile


class DummyRequest:
    def __init__(self, cookies=None):
        self.cookies = cookies or {}


def build_token(profile: str):
    payload = {
        "sub": "user-id-123",
        "registration_id": "24123456",
        "email": "24123456@discente.uefs.br",
        "profile": profile,
        "full_name": "Test User",
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def test_get_current_user_with_valid_bearer_token():
    token = build_token(UserProfile.STUDENT)
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    request = DummyRequest()

    current_user = get_current_user(request=request, credentials=credentials)

    assert isinstance(current_user, TokenData)
    assert current_user.profile == UserProfile.STUDENT
    assert current_user.email == "24123456@discente.uefs.br"


def test_get_current_user_missing_token_raises():
    request = DummyRequest()

    with pytest.raises(UnauthorizedException):
        get_current_user(request=request, credentials=None)


def test_require_admin_allows_admin():
    current_user = TokenData(
        sub="user-id-123",
        registration_id="24123456",
        email="admin@uefs.br",
        profile=UserProfile.ADMIN,
        full_name="Admin User",
    )

    result = require_admin(current_user=current_user)

    assert result is current_user


def test_require_admin_rejects_student():
    current_user = TokenData(
        sub="user-id-123",
        registration_id="24123456",
        email="24123456@discente.uefs.br",
        profile=UserProfile.STUDENT,
        full_name="Student User",
    )

    with pytest.raises(UnauthorizedException):
        require_admin(current_user=current_user)


def test_require_driver_rejects_non_driver():
    current_user = TokenData(
        sub="user-id-123",
        registration_id="24123456",
        email="driver@uefs.br",
        profile=UserProfile.STAFF,
        full_name="Staff User",
    )

    with pytest.raises(UnauthorizedException):
        require_driver(current_user=current_user)


def test_require_student_allows_student():
    current_user = TokenData(
        sub="user-id-123",
        registration_id="24123456",
        email="24123456@discente.uefs.br",
        profile=UserProfile.STUDENT,
        full_name="Student User",
    )

    result = require_student(current_user=current_user)

    assert result is current_user
