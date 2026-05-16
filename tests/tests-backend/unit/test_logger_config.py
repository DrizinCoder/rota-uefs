from app.core.logger_config import setup_app_logging


def test_logger_config_import():
    assert callable(setup_app_logging)
