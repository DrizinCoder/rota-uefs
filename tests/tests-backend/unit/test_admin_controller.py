import pytest
import uuid
from app.controllers.admin_controller import AdminController


class DummyService:
    async def create_admin(self, admin_data):
        return {'admin_id': str(uuid.uuid4()), 'full_name': admin_data.full_name}

    def serialize_admin_response(self, admin):
        return {'id': admin['admin_id'], 'full_name': admin['full_name']}

    async def get_alls_admins(self):
        return []

    def serialize_admin_list(self, admins):
        return admins

    async def get_driver(self, driver_id):
        return {'driver_id': str(driver_id)}

    async def get_admin_by_id(self, admin_id):
        return None

    async def update_admin(self, admin_id, update_data):
        return None

    async def delete_admin(self, admin_id):
        return True

    async def register_motorista(self, dados):
        return ({'email': dados.email}, 'temp-pass')

    async def delete_account(self, user_id):
        return True

    async def list_drivers(self):
        return []

    async def list_staff_status_pending(self):
        return []

    async def update_status_staff(self, user_id, status):
        return status


class DummyData:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)


@pytest.mark.asyncio
async def test_admin_controller_create_returns_serialized_response():
    service = DummyService()
    controller = AdminController(service)
    data = DummyData(
        full_name='Test Admin',
        registration_id='REG123',
        phone='000000000',
        email='admin@test.com',
        password='secret123',
        profile='Admin',
        access_level=DummyData(value='Master')
    )

    result = await controller.create(data)

    assert isinstance(result, dict)
    assert result['full_name'] == 'Test Admin'
    assert 'id' in result


@pytest.mark.asyncio
async def test_admin_controller_list_all_returns_empty_list():
    service = DummyService()
    controller = AdminController(service)

    result = await controller.list_all()

    assert result == []


@pytest.mark.asyncio
async def test_admin_controller_get_driver_returns_driver_dict():
    service = DummyService()
    controller = AdminController(service)
    driver_id = uuid.uuid4()

    result = await controller.get_driver(driver_id)

    assert isinstance(result, dict)
    assert result['driver_id'] == str(driver_id)


@pytest.mark.asyncio
async def test_admin_controller_update_status_staff_returns_same_status():
    service = DummyService()
    controller = AdminController(service)
    user_id = uuid.uuid4()

    result = await controller.update_status_staff(user_id, True)

    assert result is True
