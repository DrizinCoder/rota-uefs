from app.routers.routes import router


def test_app_router_includes_subrouters():
    paths = [route.path for route in router.routes]
    assert any(path.startswith('/tests') for path in paths)
    assert any(path.startswith('/users') for path in paths)
    assert any(path.startswith('/trip') for path in paths)
    assert any(path.startswith('/checkin') for path in paths)
