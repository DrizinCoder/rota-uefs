from app.controllers.user_controller import UserController


def test_user_controller_import():
    assert hasattr(UserController, 'request_email_change')
    assert hasattr(UserController, 'confirm_email_change')
