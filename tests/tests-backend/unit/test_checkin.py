import uuid
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest
from app.DTOs.checkin import CheckinRequestDTO, ManualCheckinRequestDTO
from app.services.reservation_service import ReservationService
from app.core.exceptions import BadRequestException, NotFoundException


def test_checkin_dto_validation():
    request_dto = CheckinRequestDTO(trip_id=uuid.uuid4(), checkin_code="1234.abcd")

    assert request_dto.trip_id
    assert request_dto.checkin_code == "1234.abcd"

    manual_dto = ManualCheckinRequestDTO(
        user_id=str(uuid.uuid4()),
        reservation_id=str(uuid.uuid4()),
        trip_id=str(uuid.uuid4())
    )

    assert manual_dto.user_id
    assert manual_dto.reservation_id
    assert manual_dto.trip_id


@pytest.mark.asyncio
async def test_checkin_with_invalid_code_format_raises_unauthorized():
    repository = AsyncMock()
    service = ReservationService(repository, AsyncMock())

    with pytest.raises(BadRequestException):
        await service.checkin(uuid.uuid4(), "bad.code")


@pytest.mark.asyncio
async def test_checkin_missing_reservation_raises_not_found():
    repository = AsyncMock()
    repository.get_by_id.return_value = None
    service = ReservationService(repository, AsyncMock())
    code = f"{uuid.uuid4()}.deadbeef"

    with pytest.raises(NotFoundException):
        await service.checkin(uuid.uuid4(), code)


@pytest.mark.asyncio
async def test_checkin_with_invalid_hmac_raises_unauthorized():
    reservation_id = uuid.uuid4()
    trip_id = uuid.uuid4()
    reservation = SimpleNamespace(
        reservation_id=reservation_id,
        trip_id=trip_id,
        user=SimpleNamespace(registration_id="24123456"),
        boarding_confirmation=None
    )
    repository = AsyncMock()
    repository.get_by_id.return_value = reservation
    service = ReservationService(repository, AsyncMock())

    invalid_code = f"{reservation_id}.invalidhmac"

    with pytest.raises(BadRequestException):
        await service.checkin(trip_id, invalid_code)


@pytest.mark.asyncio
async def test_manual_checkin_success_with_valid_data():
    user_id = uuid.uuid4()
    trip_id = uuid.uuid4()
    reservation_id = uuid.uuid4()
    reservation = SimpleNamespace(
        reservation_id=reservation_id,
        trip_id=trip_id,
        user=SimpleNamespace(user_id=user_id, registration_id="24123456"),
        boarding_confirmation=None
    )
    repository = AsyncMock()
    repository.get_by_id.return_value = reservation
    repository.update_boarding = AsyncMock()
    service = ReservationService(repository, AsyncMock())

    manual_data = ManualCheckinRequestDTO(
        user_id=str(user_id),
        reservation_id=str(reservation_id),
        trip_id=str(trip_id)
    )

    with patch.object(ReservationService, 'check_reservation', new=AsyncMock(return_value=True)):
        result = await service.manual_checkin(manual_data)

    assert result["message"] == "Checkin manual realizado com sucesso"
    assert repository.update_boarding.await_count == 1