from fastapi.testclient import TestClient
from app.main import app


def test_health_check_redirects_to_frontend():
    client = TestClient(app)
    response = client.get("/", follow_redirects=False)

    assert response.status_code in (307, 308)
    assert response.headers.get("location") is not None
