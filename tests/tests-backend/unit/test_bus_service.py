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


def test_get_by_plate_raises_not_found_when_missing():
    repository = MagicMock()
    repository.get_by_plate = AsyncMock(return_value=None)
    service = BusService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.get_by_plate('MISSING'))


def test_delete_batch_returns_number_of_plates():
    repository = MagicMock()
    repository.delete_batch = AsyncMock(return_value=None)
    service = BusService(repository)

    count = asyncio.run(service.delete_batch(MagicMock(bus_plates=['A', 'B'])))

    assert count == 2

