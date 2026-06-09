import asyncio
from unittest.mock import AsyncMock, MagicMock

import pytest
from app.core.exceptions import NotFoundException
from app.services.bus_service import BusService


def test_get_by_plate_returns_bus():
    repository = MagicMock()
    repository.get_by_plate = AsyncMock(return_value={'bus_plate': 'ABC1234'})
    service = BusService(repository)

    result = asyncio.run(service.get_by_plate('ABC1234'))

    assert result == {'bus_plate': 'ABC1234'}
    repository.get_by_plate.assert_awaited_once_with('ABC1234')


def test_get_by_plate_raises_not_found_when_missing():
    repository = MagicMock()
    repository.get_by_plate = AsyncMock(return_value=None)
    service = BusService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.get_by_plate('MISSING'))


def test_create_returns_new_bus():
    bus_data = MagicMock(bus_plate='ABC1234', capacity=40, bus_status='Active')
    repository = MagicMock()
    repository.create = AsyncMock(return_value={'bus_plate': 'ABC1234'})
    service = BusService(repository)

    result = asyncio.run(service.create(bus_data))

    assert result == {'bus_plate': 'ABC1234'}
    repository.create.assert_awaited_once_with(bus_data)


def test_delete_batch_returns_plate_count():
    repository = MagicMock()
    repository.delete_batch = AsyncMock(return_value=None)
    service = BusService(repository)

    count = asyncio.run(service.delete_batch(MagicMock(bus_plates=['A', 'B'])))

    assert count == 2
    repository.delete_batch.assert_awaited_once()

