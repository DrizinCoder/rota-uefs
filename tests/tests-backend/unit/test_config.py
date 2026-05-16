from app.core.config import settings


def test_settings_loaded():
    assert isinstance(settings.SECRET_KEY, str)
    assert settings.SECRET_KEY
    assert isinstance(settings.DATABASE_URL, str)
    assert "://" in settings.DATABASE_URL
    assert isinstance(settings.MAIL_FROM, str)
    assert "@" in settings.MAIL_FROM
    assert isinstance(settings.BASE_URL_FRONTEND, str)
