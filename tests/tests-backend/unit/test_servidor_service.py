import uuid
import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock
from app.core.exceptions import ConflictException
from app.services.admin_service import AdminService


@pytest.mark.asyncio
async def test_delete_account_returns_none_when_user_not_found():
    repository = AsyncMock()
    repository.anonymize.return_value = None
    service = AdminService(repository)

    result = await service.delete_account(uuid.uuid4())

    assert result is None
    repository.anonymize.assert_awaited_once()


@pytest.mark.asyncio
async def test_register_motorista_raises_conflict_when_already_registered():
    repository = AsyncMock()
    repository.get_by_registration_id.return_value = SimpleNamespace(profile=None)
    service = AdminService(repository)

    with pytest.raises(ConflictException):
        await service.register_motorista(SimpleNamespace(registration_id='20240001'))


@pytest.mark.asyncio
async def test_list_drivers_returns_regular_list():
    repository = AsyncMock()
    repository.list_all_drivers.return_value = [{"full_name": "Motorista Test"}]
    service = AdminService(repository)

    result = await service.list_drivers()

    assert result == [{"full_name": "Motorista Test"}]


@pytest.mark.asyncio
async def test_delete_account_returns_user_when_found():
    repository = AsyncMock()
    repository.anonymize.return_value = {'user_id': '123'}
    service = AdminService(repository)

    result = await service.delete_account(uuid.uuid4())

    assert result == {'user_id': '123'}
