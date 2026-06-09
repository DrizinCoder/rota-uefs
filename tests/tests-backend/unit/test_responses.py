from app.core.responses import ResponseHandler


def test_response_handler_ok_returns_json_with_success():
    response = ResponseHandler.ok(data={"key": "value"}, message="OK")
    assert response.status_code == 200
    assert b'"success":true' in response.body
    assert b'"key":"value"' in response.body


def test_response_handler_created_returns_201():
    response = ResponseHandler.created(data={"id": 1}, message="Created")
    assert response.status_code == 201
    assert b'"message":"Created"' in response.body


def test_response_handler_custom_supports_status_and_data():
    response = ResponseHandler.custom(status_code=418, data={"hello": "world"}, message="Custom")
    assert response.status_code == 418
    assert b'"hello":"world"' in response.body
