from app.middleware.auth_middleware import get_current_user, require_admin, require_driver, require_staff, require_student, TokenData


def test_auth_middleware_exports():
    assert callable(get_current_user)
    assert callable(require_admin)
    assert callable(require_driver)
    assert callable(require_staff)
    assert callable(require_student)
    assert TokenData.__name__ == 'TokenData'
