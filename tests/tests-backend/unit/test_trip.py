from app.DTOs.trip import CreateTripDTO, UpdateTripDTO, TripFeedItem
from app.routers.trip.routes import trip_router


def test_trip_dtos_and_router():
    assert trip_router is not None
    assert CreateTripDTO.__name__ == 'CreateTripDTO'
    assert UpdateTripDTO.__name__ == 'UpdateTripDTO'
    assert TripFeedItem.__name__ == 'TripFeedItem'
