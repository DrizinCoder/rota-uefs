from app.routers.auth.routes import router as auth_router


def test_auth_routes_import():
    assert auth_router is not None
    assert hasattr(auth_router, 'routes')
