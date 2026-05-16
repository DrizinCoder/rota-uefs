import inspect
from app.middleware.log_middleware import LogMiddleware


def test_log_middleware_dispatch_is_async_function():
    middleware = LogMiddleware(app=None)
    assert inspect.iscoroutinefunction(middleware.dispatch)
