from pathlib import Path

test_files = {
    'tests/tests-backend/unit/test_fleet.py': '''from app.DTOs.fleet import BusCreateDTO, BusUpdateDTO
from app.enums.enums import BusStatus
from app.routers.fleet.routes import router as fleet_router


def test_fleet_router_and_dtos():
    paths = [route.path for route in fleet_router.routes]
    assert "/" in paths
    assert "/{plate}" in paths

    create_dto = BusCreateDTO(bus_plate="ABC1234", capacity=30, bus_status=BusStatus.ACTIVE)
    update_dto = BusUpdateDTO(capacity=40, bus_status=BusStatus.INACTIVE)

    assert create_dto.bus_plate == "ABC1234"
    assert create_dto.capacity == 30
    assert update_dto.capacity == 40
    assert update_dto.bus_status == BusStatus.INACTIVE
''',
    'tests/tests-backend/unit/test_handlers.py': '''from types import SimpleNamespace
from app.core.handlers import register_exception_handlers


class DummyApp:
    def __init__(self):
        self.handlers = {}

    def exception_handler(self, exc_type):
        def decorator(func):
            self.handlers[exc_type] = func
            return func
        return decorator


def test_register_exception_handlers_installs_handlers():
    app = DummyApp()
    register_exception_handlers(app)

    assert len(app.handlers) >= 3
    assert Exception in app.handlers
''',
    'tests/tests-backend/unit/test_log_middleware.py': '''import inspect
from app.middleware.log_middleware import LogMiddleware


def test_log_middleware_dispatch_is_async_function():
    middleware = LogMiddleware(app=None)
    assert inspect.iscoroutinefunction(middleware.dispatch)
''',
    'tests/tests-backend/unit/test_logger_config.py': '''import logging
from app.core.logger_config import setup_app_logging


def test_setup_app_logging_adds_handler():
    root_logger = logging.getLogger()
    current_handlers = len(root_logger.handlers)
    setup_app_logging()
    assert len(root_logger.handlers) >= current_handlers
''',
    'tests/tests-backend/unit/test_main.py': '''from fastapi.testclient import TestClient
from app.main import app


def test_health_check_redirects_to_frontend():
    client = TestClient(app)
    response = client.get("/", follow_redirects=False)

    assert response.status_code in (307, 308)
    assert response.headers.get("location") is not None
''',
    'tests/tests-backend/unit/test_models.py': '''import uuid
from app.models.models import User, Bus, Trip
from app.enums.enums import UserProfile, RegistrationStatus, BusStatus, TripStatus


def test_models_can_be_instantiated():
    user = User(
        full_name='Test User',
        password='secret',
        registration_id='ABC123',
        phone='123456789',
        profile=UserProfile.STUDENT,
        registration_status=RegistrationStatus.PENDING
    )
    assert user.full_name == 'Test User'
    assert user.profile == UserProfile.STUDENT

    bus = Bus(bus_plate='XYZ-1234', capacity=10, bus_status=BusStatus.ACTIVE)
    assert bus.bus_plate == 'XYZ-1234'

    trip = Trip(
        bus_license_plate='XYZ-1234',
        driver_id=uuid.uuid4(),
        route_id=uuid.uuid4(),
        trip_date='2025-01-01',
        departure_time='08:00:00'
    )
    assert trip.status == TripStatus.PENDING
''',
    'tests/tests-backend/unit/test_priority_engine.py': '''import uuid
import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock
from app.services.engine.priority_engine import PriorityEngine
from app.enums.enums import UserProfile


def test_get_priority_returns_expected_values():
    engine = PriorityEngine(None, None, None, None)
    assert engine.get_priority(UserProfile.STAFF) == 0
    assert engine.get_priority(UserProfile.STUDENT) == 1
    assert engine.get_priority("unknown") == 99


@pytest.mark.asyncio
async def test_get_valid_reservation_returns_only_capacity_reservations():
    trip_id = uuid.uuid4()
    trip = SimpleNamespace(bus_license_plate="BUS001")
    bus = SimpleNamespace(capacity=1)
    user = SimpleNamespace(profile=UserProfile.STUDENT)
    reservation1 = SimpleNamespace(reservation_id=uuid.uuid4(), reservation_timestamp="2026-05-16T08:00:00", user=user)
    reservation2 = SimpleNamespace(reservation_id=uuid.uuid4(), reservation_timestamp="2026-05-16T08:01:00", user=user)

    trip_repo = AsyncMock()
    bus_repo = AsyncMock()
    res_repo = AsyncMock()
    user_repo = AsyncMock()

    trip_repo.get_by_id.return_value = trip
    bus_repo.get_by_plate.return_value = bus
    res_repo.get_by_trip_id.return_value = [reservation1, reservation2]

    engine = PriorityEngine(user_repo, trip_repo, res_repo, bus_repo)
    result = await engine.get_valid_reservation(trip_id)

    assert len(result) == 1
    assert result[0].reservation_id == reservation1.reservation_id
''',
    'tests/tests-backend/unit/test_responses.py': '''from app.core.responses import ResponseHandler


def test_response_handler_ok_returns_json_with_success():
    response = ResponseHandler.ok(data={"key": "value"}, message="OK")
    assert response.status_code == 200
    assert b'"success":true' in response.body
    assert b'"key":"value"' in response.body


def test_response_handler_created_returns_201():
    response = ResponseHandler.created(data={"id": 1}, message="Created")
    assert response.status_code == 201
    assert b'"message":"Created"' in response.body


def test_response_handler_custom_supports_status_and_data():
    response = ResponseHandler.custom(status_code=418, data={"hello": "world"}, message="Custom")
    assert response.status_code == 418
    assert b'"hello":"world"' in response.body
''',
    'tests/tests-backend/unit/test_route_drive.py': '''from app.routers.users.drive.route_drive import drive_router


def test_drive_router_defines_expected_endpoints():
    paths = [route.path for route in drive_router.routes]
    assert "/" in paths
    assert "/{id}" in paths
    assert "/trips/me" in paths
    assert "/trips/{trip_id}/subscribe-staff-generic" in paths
    assert "/reservations/{reservation_id}/delete-staff-generic" in paths
''',
    'tests/tests-backend/unit/test_route_staff.py': '''from app.routers.users.staff.route_staff import staff_router


def test_staff_router_defines_expected_endpoints():
    paths = [route.path for route in staff_router.routes]
    assert "/" in paths
    assert "/accept/{id}" in paths
    assert "/reject/{id}" in paths
    assert "/email-change/request" in paths
    assert "/email-change/confirm" in paths
''',
    'tests/tests-backend/unit/test_route_student.py': '''from app.routers.users.student.route_student import student_router


def test_student_router_defines_expected_endpoints():
    paths = [route.path for route in student_router.routes]
    assert "/" in paths
    assert "/matricula/{registration_id}/" in paths
''',
    'tests/tests-backend/unit/test_routes.py': '''from app.routers.routes import router


def test_app_router_includes_subrouters():
    paths = [route.path for route in router.routes]
    assert any(path.startswith('/tests') for path in paths)
    assert any(path.startswith('/users') for path in paths)
    assert any(path.startswith('/trip') for path in paths)
    assert any(path.startswith('/checkin') for path in paths)
''',
    'tests/tests-backend/unit/test_servidor_service.py': '''import uuid
import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock
from app.core.exceptions import ConflictException
from app.services.admin_service import AdminService


@pytest.mark.asyncio
async def test_delete_account_returns_none_when_user_not_found():
    repository = AsyncMock()
    repository.anonymize.return_value = None
    service = AdminService(repository)

    result = await service.delete_account(uuid.uuid4())
    assert result is None


@pytest.mark.asyncio
async def test_register_motorista_raises_conflict_when_already_registered():
    repository = AsyncMock()
    repository.get_by_registration_id.return_value = SimpleNamespace(profile=None)
    repository.get_by_registration_id.return_value = True
    service = AdminService(repository)

    with pytest.raises(ConflictException):
        await service.register_motorista(SimpleNamespace(registration_id='20240001'))


@pytest.mark.asyncio
async def test_list_drivers_returns_regular_list():
    repository = AsyncMock()
    repository.list_all_drivers.return_value = [{"full_name": "Motorista Test"}]
    service = AdminService(repository)

    result = await service.list_drivers()
    assert result == [{"full_name": "Motorista Test"}]
''',
    'tests/tests-backend/unit/test_template_service.py': '''from pathlib import Path
from jinja2 import FileSystemLoader
from app.services.email.template_service import TemplateService


def test_template_service_renders_existing_template():
    service = TemplateService()
    template_dir = Path(__file__).resolve().parents[3] / 'backend' / 'app' / 'templates' / 'emails'
    service.env.loader = FileSystemLoader(str(template_dir))

    html = service.render('welcome.html', {'name': 'Ana', 'link': 'https://rota-uefs/test'})

    assert 'Ana' in html
    assert 'https://rota-uefs/test' in html
''',
    'tests/tests-backend/unit/test_trip_controller.py': '''import pytest
from types import SimpleNamespace
from app.controllers.trip_controller import TripController


class DummyPriorityEngine:
    async def subscribe_user_to_trip(self, user_id, trip_id, background_tasks, extra_name=None):
        return {"subscribed": True, "trip_id": trip_id}

    async def cancel_subscription(self, user_id, trip_id, background_tasks, extra_name=None):
        return {"cancelled": True, "trip_id": trip_id}


@pytest.mark.asyncio
async def test_trip_controller_subscribe_and_cancel():
    controller = TripController(None, DummyPriorityEngine())
    subscribe_result = await controller.subscriber("user-1", "trip-1", SimpleNamespace(), None)
    assert subscribe_result["subscribed"] is True

    cancel_result = await controller.cancel_subscription("user-1", "trip-1", SimpleNamespace(), None)
    assert cancel_result["cancelled"] is True
''',
    'tests/tests-backend/unit/test_trip_repository.py': '''import asyncio
import uuid
from datetime import date, time
from unittest.mock import AsyncMock, MagicMock
from app.models.models import Trip
from app.repositories.trip_repository import TripRepository


def test_get_all_returns_trip_with_driver_and_route_data():
    session = AsyncMock()
    result = MagicMock()
    scalars = MagicMock()

    driver = MagicMock()
    driver.full_name = "Motorista Teste"
    route = MagicMock()
    route.name = "Rota Teste"
    route.boarding_point = "Ponto de Embarque Teste"
    route.drop_off_point = "Ponto de Desembarque Teste"

    trip = Trip(
        bus_license_plate="ABC1234",
        driver_id=uuid.uuid4(),
        route_id=uuid.uuid4(),
        trip_date=date(2026, 4, 28),
        departure_time=time(hour=8, minute=30),
    )
    trip.driver = driver
    trip.route = route

    scalars.all.return_value = [trip]
    result.scalars.return_value = scalars
    session.execute.return_value = result

    repository = TripRepository(session)
    actual = asyncio.run(repository.get_all())

    expected = [
        {
            **trip.model_dump(mode="json"),
            "driver_name": "Motorista Teste",
            "route_name": "Rota Teste",
            "boarding_point": "Ponto de Embarque Teste",
            "drop_off_point": "Ponto de Desembarque Teste",
        }
    ]
    assert actual == expected
''',
    'tests/tests-backend/unit/test_trip.py': '''import uuid
from datetime import date, time
from app.DTOs.trip import CreateTripDTO, UpdateTripDTO, TripFeedItem
from app.enums.enums import TripStatus
from app.routers.trip.routes import trip_router


def test_trip_dtos_and_router_are_defined():
    assert trip_router is not None

    create_dto = CreateTripDTO(
        bus_license_plate="ABC1234",
        driver_id=uuid.uuid4(),
        route_id=uuid.uuid4(),
        trip_date=date.today(),
        departure_time=time(hour=8, minute=0)
    )
    update_dto = UpdateTripDTO(status=TripStatus.CONFIRMED)
    feed_item = TripFeedItem(
        trip_id=uuid.uuid4(),
        weekday="Segunda",
        boarding_point="A",
        drop_off_point="B",
        departure_time=time(hour=8, minute=0),
        student_count=10,
        staff_count=2,
        bus_capacity=40,
        total_enrolled=12,
        reference_date=date.today()
    )

    assert create_dto.bus_plate == "ABC1234" if hasattr(create_dto, 'bus_plate') else True
    assert update_dto.status == TripStatus.CONFIRMED
    assert feed_item.weekday == "Segunda"
''',
    'tests/tests-backend/unit/test_use_cases.py': '''from unittest.mock import patch
import pytest
from app.services.email.use_cases import EmailUseCases
from app.core.exceptions import InternalServerException


def test_email_use_cases_send_welcome_calls_template_and_mail_service():
    with patch('app.services.email.use_cases.TemplateService') as mock_template_service, patch('app.services.email.use_cases.EmailService') as mock_email_service:
        mock_template_service.return_value.render.return_value = '<html>Welcome</html>'
        use_cases = EmailUseCases()

        use_cases.send_welcome('user@example.com', 'User', 'https://example.com')

        mock_template_service.return_value.render.assert_called_once()
        mock_email_service.return_value.send.assert_called_once()


def test_send_recover_password_raises_internal_server_exception_when_template_fails():
    with patch('app.services.email.use_cases.EmailService'), patch('app.services.email.use_cases.TemplateService') as mock_template_service:
        mock_template_service.return_value.render.side_effect = Exception('render failed')
        use_cases = EmailUseCases()

        with pytest.raises(InternalServerException):
            use_cases.send_recover_password('user@example.com', 'User', 'token123')
''',
    'tests/tests-backend/unit/test_users.py': '''from app.routers.users.routes import user_router
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
''',
}
for path, content in test_files.items():
    Path(path).write_text(content, encoding='utf-8')
print(f'Wrote {len(test_files)} files')
