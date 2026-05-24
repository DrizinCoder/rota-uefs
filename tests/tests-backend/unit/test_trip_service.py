import asyncio
import uuid
from datetime import date
from unittest.mock import AsyncMock, MagicMock

import pytest
from app.core.exceptions import NotFoundException
from app.enums.enums import TripRecurrence
from app.services.trip_service import TripService
from app.DTOs.trip import UpdateTripDTO


def test_generate_dates_single_returns_start_date_only():
    service = TripService(AsyncMock())

    result = service._generate_dates(date(2026, 5, 1), TripRecurrence.SINGLE)

    assert result == [date(2026, 5, 1)]


def test_generate_dates_weekly_returns_consecutive_weekdays():
    service = TripService(AsyncMock())

    result = service._generate_dates(date(2026, 5, 4), TripRecurrence.WEEKLY)

    assert result == [date(2026, 5, 4), date(2026, 5, 5), date(2026, 5, 6), date(2026, 5, 7), date(2026, 5, 8)]


def test_generate_dates_monthly_excludes_weekends():
    service = TripService(AsyncMock())

    result = service._generate_dates(date(2026, 5, 1), TripRecurrence.MONTHLY)

    assert all(day.weekday() < 5 for day in result)
    assert date(2026, 5, 1) in result


def test_create_returns_list_of_json_trips():
    trip = MagicMock()
    trip.model_dump.return_value = {'trip_id': str(uuid.uuid4())}
    repository = AsyncMock()
    repository.create.return_value = trip
    service = TripService(repository)

    dto = MagicMock(
        recurrence=TripRecurrence.SINGLE,
        trip_date=date(2026, 5, 1),
        model_copy=lambda update: trip
    )

    result = asyncio.run(service.create(dto))

    assert isinstance(result, list)
    assert result[0]['trip_id'] == trip.model_dump.return_value['trip_id']
    repository.create.assert_awaited_once()


def test_get_by_id_raises_not_found_when_trip_missing():
    repository = AsyncMock()
    repository.get_by_id.return_value = None
    service = TripService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.get_by_id(uuid.uuid4()))


def test_patch_returns_json_when_trip_exists():
    trip = MagicMock()
    trip.model_dump.return_value = {'trip_id': str(uuid.uuid4())}
    repository = AsyncMock()
    repository.patch.return_value = trip
    service = TripService(repository)

    result = asyncio.run(service.patch(uuid.uuid4(), UpdateTripDTO()))

    assert result == {'trip_id': trip.model_dump.return_value['trip_id']}
    repository.patch.assert_awaited_once()


def test_get_by_date_returns_json_list():
    trip = MagicMock()
    trip.model_dump.return_value = {'trip_id': str(uuid.uuid4())}
    repository = AsyncMock()
    repository.get_by_date.return_value = [trip]
    service = TripService(repository)

    result = asyncio.run(service.get_by_date(date(2026, 5, 1)))

    assert result == [{'trip_id': trip.model_dump.return_value['trip_id']}]
    repository.get_by_date.assert_awaited_once_with(date(2026, 5, 1))
