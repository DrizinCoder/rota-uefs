from app.middleware.log_middleware import LogMiddleware


def test_log_middleware_import():
    assert hasattr(LogMiddleware, 'dispatch') or hasattr(LogMiddleware, 'process_request')
