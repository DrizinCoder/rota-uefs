from app.routers.users.drive.route_drive import drive_router


def test_route_drive_import():
    assert drive_router is not None
