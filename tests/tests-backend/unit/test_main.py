from app.main import app, health_check


def test_main_app_import():
    assert app.title is not None
    assert callable(health_check)
