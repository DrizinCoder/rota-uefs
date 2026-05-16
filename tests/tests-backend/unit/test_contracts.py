from app.main import app


def test_app_existe():
    assert app is not None


def test_app_tem_rotas_registradas():
    assert len(app.routes) > 0
