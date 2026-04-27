def test_api_root_responde_200(client):
    response = client.get("/")
    assert response.status_code == 200


def test_api_root_retorna_json(client):
    response = client.get("/")
    assert isinstance(response.json(), dict)
