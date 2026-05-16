import uuid
import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock
from app.services.driver_service import DriverService
from app.DTOs.driver import DriverPatchDTO
from app.enums.enums import UserProfile
from app.core.exceptions import BadRequestException, NotFoundException


def build_driver_patch_data():
    return DriverPatchDTO(
        full_name="Driver Name",
        email="driver@example.com",
        phone="11999999999",
        registration_id="20240001"
    )


@pytest.mark.asyncio
async def test_driver_update_raises_not_found_when_driver_missing():
    repository = AsyncMock()
    repository.get_by_id.return_value = None
    service = DriverService(repository)

    with pytest.raises(NotFoundException):
        await service.update_driver(uuid.uuid4(), build_driver_patch_data())


@pytest.mark.asyncio
async def test_driver_update_rejects_non_driver_profile():
    repository = AsyncMock()
    repository.get_by_id.return_value = SimpleNamespace(profile=UserProfile.STUDENT)
    service = DriverService(repository)

    with pytest.raises(BadRequestException):
        await service.update_driver(uuid.uuid4(), build_driver_patch_data())


@pytest.mark.asyncio
async def test_driver_update_calls_repository_for_valid_driver():
    repository = AsyncMock()
    driver = SimpleNamespace(profile=UserProfile.DRIVER)
    repository.get_by_id.return_value = driver
    repository.update_driver.return_value = {"updated": True}
    service = DriverService(repository)
    data = build_driver_patch_data()

    result = await service.update_driver(uuid.uuid4(), data)

    assert result == {"updated": True}
    repository.update_driver.assert_awaited_once_with(driver, data)
