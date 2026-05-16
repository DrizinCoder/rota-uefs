from app.routers.users.staff.route_staff import staff_router


def test_route_staff_import():
    assert staff_router is not None
