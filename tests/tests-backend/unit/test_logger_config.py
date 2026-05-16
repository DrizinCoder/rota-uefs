import logging
from app.core.logger_config import setup_app_logging


def test_setup_app_logging_adds_handler():
    root_logger = logging.getLogger()
    current_handlers = len(root_logger.handlers)
    setup_app_logging()
    assert len(root_logger.handlers) >= current_handlers
