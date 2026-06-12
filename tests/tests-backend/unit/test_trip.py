import uuid
from datetime import date, time
from app.DTOs.trip import CreateTripDTO, UpdateTripDTO, TripFeedItem
from app.enums.enums import TripStatus
from app.routers.trip.routes import trip_router


def test_trip_dtos_validate_expected_fields_and_router_endpoints():
    assert trip_router is not None

    create_dto = CreateTripDTO(
        bus_license_plate="ABC1234",
        driver_id=uuid.uuid4(),
        route_id=uuid.uuid4(),
        trip_date=date.today(),
        departure_time=time(hour=8, minute=0)
    )
    update_dto = UpdateTripDTO(status=TripStatus.CONFIRMED)
    feed_item = TripFeedItem(
        trip_id=uuid.uuid4(),
        weekday="Segunda",
        boarding_point="A",
        drop_off_point="B",
        departure_time=time(hour=8, minute=0),
        student_count=10,
        staff_count=2,
        bus_capacity=40,
        total_enrolled=12,
        status=TripStatus.CONFIRMED,
        reference_date=date.today()
    )

    assert create_dto.bus_license_plate == "ABC1234"
    assert update_dto.status == TripStatus.CONFIRMED
    assert feed_item.weekday == "Segunda"
    assert len(trip_router.routes) > 0
