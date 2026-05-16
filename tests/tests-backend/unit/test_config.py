from app.core.config import settings


def test_settings_loaded():
    assert hasattr(settings, 'SECRET_KEY')
    assert hasattr(settings, 'DATABASE_URL')
    assert hasattr(settings, 'MAIL_FROM')
