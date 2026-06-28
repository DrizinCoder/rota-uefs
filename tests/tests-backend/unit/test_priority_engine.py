import uuid
import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock
from app.services.engine.priority_engine import PriorityEngine
from app.enums.enums import UserProfile


def test_get_priority_returns_expected_values():
    engine = PriorityEngine(None, None, None, None, None)
    assert engine.get_priority(UserProfile.STAFF, None) == 0
    assert engine.get_priority(UserProfile.STUDENT, None) == 2
    assert engine.get_priority("unknown", None) == 99


@pytest.mark.asyncio
async def test_get_valid_reservation_returns_only_capacity_reservations():
    trip_id = uuid.uuid4()
    trip = SimpleNamespace(bus_license_plate="BUS001")
    bus = SimpleNamespace(capacity=1)
    user = SimpleNamespace(profile=UserProfile.STUDENT)
    reservation1 = SimpleNamespace(reservation_id=uuid.uuid4(), reservation_timestamp="2026-05-16T08:00:00", user=user, boarding_confirmation=None, extra_passenger_name=None)
    reservation2 = SimpleNamespace(reservation_id=uuid.uuid4(), reservation_timestamp="2026-05-16T08:01:00", user=user, boarding_confirmation=None, extra_passenger_name=None)

    trip_repo = AsyncMock()
    bus_repo = AsyncMock()
    res_repo = AsyncMock()
    user_repo = AsyncMock()

    trip_repo.get_by_id.return_value = trip
    bus_repo.get_by_plate.return_value = bus
    res_repo.get_by_trip_id.return_value = [reservation1, reservation2]

    engine = PriorityEngine(user_repo, trip_repo, res_repo, bus_repo, None)
    result = await engine.get_valid_reservation(trip_id)

    assert len(result) == 1
    assert result[0].reservation_id == reservation1.reservation_id
