import asyncio
import uuid
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from app.core.exceptions import ConflictException, NotFoundException
from app.enums.enums import AccessLevel, UserProfile
from app.services.admin_service import AdminService


def make_admin(user_id=None, anonymized=False):
    user_id = user_id or uuid.uuid4()
    user = SimpleNamespace(
        user_id=user_id,
        full_name='Admin Test',
        email='admin@test.com',
        phone='123456789',
        registration_id='20240001',
        registration_status='Active',
        is_anonymized=anonymized,
        profile=UserProfile.ADMIN,
    )
    admin = SimpleNamespace(
        admin_id=user_id,
        user=user,
        access_level=AccessLevel.MASTER,
    )
    return admin


def test_serialize_admin_response_contains_expected_fields():
    service = AdminService(user_repository=MagicMock())
    admin = make_admin()

    result = service.serialize_admin_response(admin)

    assert result['admin_id'] == str(admin.admin_id)
    assert result['email'] == admin.user.email
    assert result['access_level'] == admin.access_level.value


def test_delete_admin_returns_false_when_missing():
    repository = MagicMock()
    repository.get_admin_full = AsyncMock(return_value=None)
    service = AdminService(user_repository=repository)

    result = asyncio.run(service.delete_admin(uuid.uuid4()))

    assert result is False


def test_delete_admin_returns_false_when_admin_is_anonymized():
    admin = make_admin(anonymized=True)
    repository = MagicMock()
    repository.get_admin_full = AsyncMock(return_value=admin)
    service = AdminService(user_repository=repository)

    result = asyncio.run(service.delete_admin(uuid.uuid4()))

    assert result is False


def test_update_status_staff_raises_not_found_when_user_missing():
    repository = MagicMock()
    repository.update_status_staff = AsyncMock(return_value=None)
    service = AdminService(user_repository=repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.update_status_staff(uuid.uuid4(), True))


def test_list_drivers_returns_driver_list():
    repository = MagicMock()
    repository.list_all_drivers = AsyncMock(return_value=[{'name': 'Driver Test'}])
    service = AdminService(user_repository=repository)

    result = asyncio.run(service.list_drivers())

    assert result == [{'name': 'Driver Test'}]
