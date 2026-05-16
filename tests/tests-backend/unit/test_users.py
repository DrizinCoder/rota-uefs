from app.routers.users.routes import user_router
from app.DTOs.users import PasswordUpdate, PhoneUpdate


def test_users_routes_and_dtos():
    assert user_router is not None
    assert PasswordUpdate.__name__ == 'PasswordUpdate'
    assert PhoneUpdate.__name__ == 'PhoneUpdate'
