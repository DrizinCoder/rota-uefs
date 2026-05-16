import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from app.core.exceptions import BadRequestException, NotFoundException
from app.enums.enums import UserProfile
from app.services.driver_service import DriverService


def test_update_driver_raises_not_found_when_user_missing():
    repository = AsyncMock()
    repository.get_by_id.return_value = None
    service = DriverService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.update_driver('00000000-0000-0000-0000-000000000000', SimpleNamespace()))


def test_update_driver_raises_bad_request_when_user_is_not_driver():
    repository = AsyncMock()
    repository.get_by_id.return_value = SimpleNamespace(profile=UserProfile.STUDENT)
    service = DriverService(repository)

    with pytest.raises(BadRequestException):
        asyncio.run(service.update_driver('00000000-0000-0000-0000-000000000000', SimpleNamespace()))


def test_update_driver_returns_updated_driver_when_profile_is_driver():
    repository = AsyncMock()
    repository.get_by_id.return_value = SimpleNamespace(profile=UserProfile.DRIVER)
    repository.update_driver.return_value = {'updated': True}
    service = DriverService(repository)

    result = asyncio.run(service.update_driver('00000000-0000-0000-0000-000000000000', SimpleNamespace()))

    assert result == {'updated': True}
