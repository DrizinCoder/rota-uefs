import uuid
from unittest.mock import AsyncMock, patch

import pytest
from types import SimpleNamespace
from app.DTOs.checkin import ManualCheckinRequestDTO
from app.services.reservation_service import ReservationService
from app.core.exceptions import BadRequestException, NotFoundException


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
async def test_reservation_service_checkin_raises_not_found_when_reservation_missing():
    repository = AsyncMock()
    repository.get_by_id.return_value = None
    service = ReservationService(repository, DummyPriorityEngine([]))

    invalid_code = f"{uuid.uuid4()}.deadbeef"

    with pytest.raises(NotFoundException):
        await service.checkin(uuid.uuid4(), invalid_code)


@pytest.mark.asyncio
async def test_reservation_service_checkin_raises_unauthorized_for_invalid_code():
    reservation_id = uuid.uuid4()
    trip_id = uuid.uuid4()
    user = SimpleNamespace(registration_id='24123456')
    reservation = SimpleNamespace(reservation_id=reservation_id, trip_id=trip_id, user=user, boarding_confirmation=None)

    repository = AsyncMock()
    repository.get_by_id.return_value = reservation
    service = ReservationService(repository, DummyPriorityEngine([reservation_id]))

    invalid_code = f"{reservation_id}.badhash"

    with pytest.raises(BadRequestException):
        await service.checkin(trip_id, invalid_code)


@pytest.mark.asyncio
async def test_reservation_service_manual_checkin_success():
    reservation_id = uuid.uuid4()
    trip_id = uuid.uuid4()
    user_id = uuid.uuid4()
    reservation = SimpleNamespace(
        reservation_id=reservation_id,
        trip_id=trip_id,
        user=SimpleNamespace(user_id=user_id, registration_id="24123456"),
        boarding_confirmation=None
    )
    repo = DummyRepository(reservation)
    service = ReservationService(repo, DummyPriorityEngine([reservation_id]))

    data = ManualCheckinRequestDTO(
        user_id=str(user_id),
        reservation_id=str(reservation_id),
        trip_id=str(trip_id),
    )

    with patch.object(ReservationService, 'check_reservation', new=lambda self, trip_id, reservation_id: True):
        result = await service.manual_checkin(data)

    assert result == {"message": "Checkin manual realizado com sucesso"}
    assert repo.updated is True
