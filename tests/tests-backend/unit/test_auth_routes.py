from app.routers.auth.routes import router as auth_router


def test_auth_router_has_expected_endpoints():
    paths = [route.path for route in auth_router.routes]
    assert "/login" in paths
    assert "/register/student" in paths
    assert "/register/staff" in paths
    assert "/recover/password" in paths
    assert "/reset/password" in paths


def test_auth_router_methods_are_post_for_action_endpoints():
    route_methods = {route.path: route.methods for route in auth_router.routes}
    assert "POST" in route_methods["/login"]
    assert "POST" in route_methods["/register/student"]
    assert "POST" in route_methods["/register/staff"]
