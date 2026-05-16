import pytest
from app.controllers.auth_controller import AuthController


def test_auth_controller_has_required_methods():
    assert hasattr(AuthController, 'register_student')
    assert hasattr(AuthController, 'login')
    assert hasattr(AuthController, 'recover_password')
    assert hasattr(AuthController, 'reset_password')
