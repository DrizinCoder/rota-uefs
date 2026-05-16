from app.controllers.trip_controller import TripController


def test_trip_controller_import():
    assert hasattr(TripController, 'subscriber')
    assert hasattr(TripController, 'cancel_subscription')
