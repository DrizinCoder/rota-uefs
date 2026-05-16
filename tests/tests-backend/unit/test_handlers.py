from types import SimpleNamespace
from app.core.handlers import register_exception_handlers


class DummyApp:
    def __init__(self):
        self.handlers = {}

    def exception_handler(self, exc_type):
        def decorator(func):
            self.handlers[exc_type] = func
            return func
        return decorator


def test_register_exception_handlers_installs_handlers():
    app = DummyApp()
    register_exception_handlers(app)

    assert len(app.handlers) >= 3
    assert Exception in app.handlers
