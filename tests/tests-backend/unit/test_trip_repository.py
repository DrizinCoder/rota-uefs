import asyncio
import uuid
from datetime import date, time
from unittest.mock import AsyncMock, MagicMock
from app.models.models import Trip
from app.repositories.trip_repository import TripRepository


def test_get_all_returns_trip_with_driver_and_route_data():
    session = AsyncMock()
    result = MagicMock()
    scalars = MagicMock()

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

    scalars.all.return_value = [trip]
    result.scalars.return_value = scalars
    session.execute.return_value = result

    repository = TripRepository(session)
    actual = asyncio.run(repository.get_all())

    expected = [
        {
            **trip.model_dump(mode="json"),
            "driver_name": "Motorista Teste",
            "route_name": "Rota Teste",
            "boarding_point": "Ponto de Embarque Teste",
            "drop_off_point": "Ponto de Desembarque Teste",
        }
    ]
    assert actual == expected
