import asyncio
from unittest.mock import AsyncMock, MagicMock
from app.repositories.reservation_repository import ReservationRepository


def test_cancel_reservation_updates_boarding_status_and_commits():
    session = AsyncMock()
    result = MagicMock()
    result.rowcount = 1
    session.execute.return_value = result
    session.commit = AsyncMock()

    repository = ReservationRepository(session)
    updated = asyncio.run(repository.cancel_reservation("reservation-123"))

    assert updated is True
    session.commit.assert_awaited_once()


def test_cancel_reservation_returns_false_when_not_found():
    session = AsyncMock()
    result = MagicMock()
    result.rowcount = 0
    session.execute.return_value = result
    session.commit = AsyncMock()

    repository = ReservationRepository(session)
    updated = asyncio.run(repository.cancel_reservation("missing"))

    assert updated is False
    session.commit.assert_awaited_once()


def test_delete_returns_true_when_reservation_exists():
    session = AsyncMock()
    result = MagicMock()
    result.rowcount = 1
    session.execute.return_value = result
    session.commit = AsyncMock()

    repository = ReservationRepository(session)
    deleted = asyncio.run(repository.delete("reservation-123"))

    assert deleted is True
    session.commit.assert_awaited_once()


def test_delete_returns_false_when_reservation_missing():
    session = AsyncMock()
    result = MagicMock()
    result.rowcount = 0
    session.execute.return_value = result
    session.commit = AsyncMock()

    repository = ReservationRepository(session)
    deleted = asyncio.run(repository.delete("missing"))

    assert deleted is False
    session.commit.assert_awaited_once()