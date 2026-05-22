from app.core.config import settings


def test_api_root_retornou_redirecionamento_para_frontend(client):
    response = client.get("/", follow_redirects=False)

    assert response.status_code == 307
    assert response.headers["location"] == settings.BASE_URL_FRONTEND


def test_api_root_redireciona_para_url_frontend_valida(client):
    response = client.get("/", follow_redirects=False)

    assert "location" in response.headers
    assert response.headers["location"].startswith("http")
