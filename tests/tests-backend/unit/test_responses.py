from app.core.responses import ResponseHandler


def test_response_handler_methods():
    assert callable(ResponseHandler.ok)
    assert callable(ResponseHandler.created)
    assert callable(ResponseHandler.accepted)
    assert callable(ResponseHandler.no_content)
    assert callable(ResponseHandler.custom)
