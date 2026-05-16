from app.enums.enums import UserProfile, RegistrationStatus, BusStatus, TripStatus


def test_enums_values():
    assert UserProfile.ADMIN.value == 'Admin'
    assert RegistrationStatus.PENDING.value == 'Pending'
    assert BusStatus.ACTIVE.value == 'Active'
    assert TripStatus.CANCELLED.value == 'Cancelled'
