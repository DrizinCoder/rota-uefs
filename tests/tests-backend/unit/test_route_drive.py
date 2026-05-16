from app.routers.users.drive.route_drive import drive_router


def test_drive_router_defines_expected_endpoints():
    paths = [route.path for route in drive_router.routes]
    assert "/" in paths
    assert "/{id}" in paths
    assert "/trips/me" in paths
    assert "/trips/{trip_id}/subscribe-staff-generic" in paths
    assert "/reservations/{reservation_id}/delete-staff-generic" in paths
