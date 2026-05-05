import asyncio
import uuid
from datetime import date, time
from unittest.mock import AsyncMock, MagicMock

from app.models.models import Trip
from app.repositories.trip_repository import TripRepository


def test_get_all_returns_driver_and_route_names():
    mock_session = AsyncMock()
    mock_result = MagicMock()
    mock_scalars = MagicMock()

    driver = MagicMock()
    driver.full_name = "Motorista Teste"

    route = MagicMock()
    route.name = "Rota Teste"
    route.boarding_point = "Ponto de Embarque Teste"
    route.drop_off_point = "Ponto de Desembarque Teste"

    trip = Trip(
        bus_license_plate="ABC1234",
        driver_id=uuid.uuid4(),
        route_id=uuid.uuid4(),
        trip_date=date(2026, 4, 28),
        departure_time=time(hour=8, minute=30),
    )
    trip.driver = driver
    trip.route = route

    mock_scalars.all.return_value = [trip]
    mock_result.scalars.return_value = mock_scalars
    mock_session.execute.return_value = mock_result

    repository = TripRepository(mock_session)
    result = asyncio.run(repository.get_all())

    expected = [
        {
            **trip.model_dump(mode="json"),
            "driver_name": "Motorista Teste",
            "route_name": "Rota Teste",
            "boarding_point": "Ponto de Embarque Teste",
            "drop_off_point": "Ponto de Desembarque Teste",
        }
    ]

    assert result == expected
