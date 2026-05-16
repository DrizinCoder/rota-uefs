from app.routers.users.dependencies import get_user_service, get_trip_service, get_trip_controller, get_driver_service


def test_dependencies_exports():
    assert callable(get_user_service)
    assert callable(get_trip_service)
    assert callable(get_trip_controller)
    assert callable(get_driver_service)
