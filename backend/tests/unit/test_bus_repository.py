import asyncio
from unittest.mock import AsyncMock, MagicMock

from app.repositories.bus_repository import BusRepository


def test_get_by_plate_returns_bus():
    session = AsyncMock()
    result = MagicMock()
    result.scalar_one_or_none.return_value = {'bus_plate': 'ABC1234'}
    session.execute.return_value = result

    repository = BusRepository(session)
    bus = asyncio.run(repository.get_by_plate('ABC1234'))

    assert bus == {'bus_plate': 'ABC1234'}
    session.execute.assert_called_once()


def test_delete_returns_none_when_bus_not_found():
    repository = BusRepository(AsyncMock())
    repository.get_by_plate = AsyncMock(return_value=None)

    result = asyncio.run(repository.delete('NOTEXIST'))

    assert result is None


def test_delete_batch_commits_and_returns_true():
    session = AsyncMock()
    session.execute.return_value = MagicMock()
    repository = BusRepository(session)

    result = asyncio.run(repository.delete_batch(['ABC1234', 'DEF5678']))

    assert result is True
    session.execute.assert_called_once()
    session.commit.assert_called_once()
