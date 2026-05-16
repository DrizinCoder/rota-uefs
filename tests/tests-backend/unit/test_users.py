from app.routers.users.routes import user_router
from app.DTOs.users import PasswordUpdate, PhoneUpdate


def test_users_router_and_dto_validation():
    paths = [route.path for route in user_router.routes]
    assert any(path.startswith('/staff') for path in paths)
    assert any(path.startswith('/driver') for path in paths)
    assert any(path.startswith('/student') for path in paths)
    assert any('/me' in path or '/trips/me' in path for path in paths)

    password_dto = PasswordUpdate(password='newsecret', confirm_password='newsecret')
    phone_dto = PhoneUpdate(phone='+5511999999999')

    assert password_dto.password == 'newsecret'
    assert phone_dto.phone == '+5511999999999'
