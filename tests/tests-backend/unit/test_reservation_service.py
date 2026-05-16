import uuid

import pytest
from types import SimpleNamespace
from app.DTOs.checkin import ManualCheckinRequestDTO
from app.services.reservation_service import ReservationService


class DummyRepository:
    def __init__(self, reservation):
        self.reservation = reservation
        self.updated = False

    async def get_by_id(self, reservation_id):
        return self.reservation

    async def update_boarding(self, reservation):
        self.updated = True


class DummyPriorityEngine:
    def __init__(self, valid_ids):
        self.valid_ids = valid_ids

    async def get_valid_reservation(self, trip_id):
        return [SimpleNamespace(reservation_id=r) for r in self.valid_ids]


@pytest.mark.asyncio
async def test_reservation_service_check_reservation_returns_true():
    reservation_id = uuid.uuid4()
    service = ReservationService(None, DummyPriorityEngine([reservation_id]))

    result = await service.check_reservation(uuid.uuid4(), reservation_id)

    assert result is True


@pytest.mark.asyncio
async def test_reservation_service_manual_checkin_success():
    reservation_id = uuid.uuid4()
    trip_id = uuid.uuid4()
    user_id = uuid.uuid4()
    reservation = SimpleNamespace(
        reservation_id=reservation_id,
        trip_id=trip_id,
        user=SimpleNamespace(user_id=user_id)
    )
    repo = DummyRepository(reservation)
    service = ReservationService(repo, DummyPriorityEngine([reservation_id]))
    service.check_reservation = lambda trip_id, reservation_id: True

    data = ManualCheckinRequestDTO(
        user_id=str(user_id),
        reservation_id=str(reservation_id),
        trip_id=str(trip_id),
    )

    result = await service.manual_checkin(data)

    assert result == {"message": "Checkin manual realizado com sucesso"}
    assert repo.updated is True
