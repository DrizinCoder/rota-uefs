import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock
from app.enums.enums import BoardingStatus
from app.repositories.reservation_repository import ReservationRepository


def test_cancel_reservation_updates_boarding_status_and_commits():
    session = AsyncMock()
    reservation = SimpleNamespace(boarding_confirmation=None)
    result = MagicMock()
    result.scalar_one_or_none.return_value = reservation
    session.execute.return_value = result
    session.commit = AsyncMock()

    repository = ReservationRepository(session)
    updated = asyncio.run(repository.cancel_reservation("reservation-123"))

    assert updated is True
    assert reservation.boarding_confirmation == BoardingStatus.CANCELLED
    session.commit.assert_awaited_once()


def test_cancel_reservation_returns_false_when_not_found():
    session = AsyncMock()
    result = MagicMock()
    result.scalar_one_or_none.return_value = None
    session.execute.return_value = result
    session.commit = AsyncMock()

    repository = ReservationRepository(session)
    updated = asyncio.run(repository.cancel_reservation("missing"))

    assert updated is False
    session.commit.assert_not_awaited()


def test_delete_returns_true_when_reservation_exists():
    session = AsyncMock()
    reservation = SimpleNamespace()
    result = MagicMock()
    result.scalar_one_or_none.return_value = reservation
    session.execute.return_value = result
    session.delete = AsyncMock()
    session.commit = AsyncMock()

    repository = ReservationRepository(session)
    deleted = asyncio.run(repository.delete("reservation-123"))

    assert deleted is True
    session.delete.assert_awaited_once_with(reservation)
    session.commit.assert_awaited_once()


def test_delete_returns_false_when_reservation_missing():
    session = AsyncMock()
    result = MagicMock()
    result.scalar_one_or_none.return_value = None
    session.execute.return_value = result
    session.delete = AsyncMock()
    session.commit = AsyncMock()

    repository = ReservationRepository(session)
    deleted = asyncio.run(repository.delete("missing"))

    assert deleted is False
    session.delete.assert_not_awaited()
    session.commit.assert_not_awaited()
