from app.routers.routes import router


def test_routes_import():
    assert router is not None
    assert hasattr(router, 'routes')
