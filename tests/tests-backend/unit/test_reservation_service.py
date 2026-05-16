from app.services.reservation_service import ReservationService


def test_reservation_service_import():
    assert hasattr(ReservationService, 'check_reservation')
    assert hasattr(ReservationService, 'checkin')
    assert hasattr(ReservationService, 'manual_checkin')
