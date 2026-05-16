from app.routers.users.staff.route_staff import staff_router


def test_staff_router_defines_expected_endpoints():
    paths = [route.path for route in staff_router.routes]
    assert "/" in paths
    assert "/accept/{id}" in paths
    assert "/reject/{id}" in paths
    assert "/email-change/request" in paths
    assert "/email-change/confirm" in paths
