import uuid
from app.models.models import User, Bus, Trip
from app.enums.enums import UserProfile, RegistrationStatus, BusStatus, TripStatus


def test_models_can_be_instantiated():
    user = User(
        full_name='Test User',
        password='secret',
        registration_id='ABC123',
        phone='123456789',
        profile=UserProfile.STUDENT,
        registration_status=RegistrationStatus.PENDING
    )
    assert user.full_name == 'Test User'
    assert user.profile == UserProfile.STUDENT

    bus = Bus(bus_plate='XYZ-1234', capacity=10, bus_status=BusStatus.ACTIVE)
    assert bus.bus_plate == 'XYZ-1234'

    trip = Trip(
        bus_license_plate='XYZ-1234',
        driver_id=uuid.uuid4(),
        route_id=uuid.uuid4(),
        trip_date='2025-01-01',
        departure_time='08:00:00'
    )
    assert trip.status == TripStatus.PENDING
