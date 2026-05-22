import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from app.core.exceptions import ConflictException
from app.enums.enums import UserProfile
from app.services.admin_service import AdminService


def test_delete_account_returns_none_when_missing():
    repository = AsyncMock()
    repository.anonymize.return_value = None
    service = AdminService(repository)

    result = asyncio.run(service.delete_account('00000000-0000-0000-0000-000000000000'))

    assert result is None


def test_register_motorista_raises_conflict_when_driver_exists():
    repository = AsyncMock()
    repository.get_by_registration_id.return_value = SimpleNamespace(profile=UserProfile.DRIVER)
    service = AdminService(repository)

    with pytest.raises(ConflictException):
        asyncio.run(service.register_motorista(SimpleNamespace(registration_id='20240001')))


def test_list_drivers_returns_driver_list():
    repository = AsyncMock()
    repository.list_all_drivers.return_value = [{'full_name': 'Motorista Test'}]
    service = AdminService(repository)

    result = asyncio.run(service.list_drivers())

    assert result == [{'full_name': 'Motorista Test'}]
