from app.core.handlers import register_exception_handlers


def test_handlers_exported():
    assert callable(register_exception_handlers)
