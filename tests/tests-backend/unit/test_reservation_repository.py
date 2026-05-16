from app.repositories.reservation_repository import ReservationRepository


def test_reservation_repository_import():
    assert hasattr(ReservationRepository, 'get_by_id') or hasattr(ReservationRepository, 'create_reservation')
