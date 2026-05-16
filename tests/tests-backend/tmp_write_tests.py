from pathlib import Path

test_files = {
    'tests/tests-backend/unit/test_auth_routes.py': '''from app.routers.auth.routes import router as auth_router


def test_auth_router_has_expected_endpoints():
    paths = [route.path for route in auth_router.routes]
    assert "/login" in paths
    assert "/register/student" in paths
    assert "/register/staff" in paths
    assert "/recover/password" in paths
    assert "/reset/password" in paths


def test_auth_router_methods_are_post_for_action_endpoints():
    route_methods = {route.path: route.methods for route in auth_router.routes}
    assert "POST" in route_methods["/login"]
    assert "POST" in route_methods["/register/student"]
    assert "POST" in route_methods["/register/staff"]
''',
    'tests/tests-backend/unit/test_checkin.py': '''import uuid
import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch
from app.DTOs.checkin import CheckinRequestDTO, ManualCheckinRequestDTO
from app.services.reservation_service import ReservationService
from app.core.exceptions import NotFoundException, UnauthorizedException


def test_checkin_dto_validation():
    request_dto = CheckinRequestDTO(trip_id=uuid.uuid4(), checkin_code="1234.abcd")
    assert request_dto.trip_id
    assert request_dto.checkin_code == "1234.abcd"

    manual_dto = ManualCheckinRequestDTO(
        user_id=str(uuid.uuid4()),
        reservation_id=str(uuid.uuid4()),
        trip_id=str(uuid.uuid4())
    )
    assert manual_dto.user_id
    assert manual_dto.reservation_id
    assert manual_dto.trip_id


def test_checkin_with_invalid_code_raises_unauthorized():
    repository = AsyncMock()
    repository.get_by_id.return_value = None
    service = ReservationService(repository, AsyncMock())

    with pytest.raises(UnauthorizedException):
        __import__('asyncio').run(service.checkin(uuid.uuid4(), "bad.code"))


def test_checkin_missing_reservation_raises_not_found():
    repository = AsyncMock()
    repository.get_by_id.return_value = None
    service = ReservationService(repository, AsyncMock())
    code = f"{uuid.uuid4()}.deadbeef"

    with pytest.raises(NotFoundException):
        __import__('asyncio').run(service.checkin(uuid.uuid4(), code))


def test_manual_checkin_success_with_valid_data():
    user_id = uuid.uuid4()
    trip_id = uuid.uuid4()
    reservation_id = uuid.uuid4()
    repository = AsyncMock()
    reservation = SimpleNamespace(
        reservation_id=reservation_id,
        trip_id=trip_id,
        user=SimpleNamespace(user_id=user_id, registration_id="24123456")
    )
    repository.get_by_id.return_value = reservation
    repository.update_boarding = AsyncMock()
    service = ReservationService(repository, AsyncMock())

    manual_data = ManualCheckinRequestDTO(
        user_id=str(user_id),
        reservation_id=str(reservation_id),
        trip_id=str(trip_id)
    )

    with patch.object(ReservationService, 'check_reservation', AsyncMock(return_value=True)):
        result = __import__('asyncio').run(service.manual_checkin(manual_data))

    assert result["message"] == "Checkin manual realizado com sucesso"
''',
    'tests/tests-backend/unit/test_config.py': '''from app.core.config import settings


def test_settings_loaded():
    assert isinstance(settings.SECRET_KEY, str)
    assert settings.SECRET_KEY
    assert isinstance(settings.DATABASE_URL, str)
    assert "://" in settings.DATABASE_URL
    assert isinstance(settings.MAIL_FROM, str)
    assert "@" in settings.MAIL_FROM
    assert isinstance(settings.BASE_URL_FRONTEND, str)
''',
    'tests/tests-backend/unit/test_contracts.py': '''from fastapi.testclient import TestClient
from app.main import app


def test_app_health_route_redirects_to_frontend():
    client = TestClient(app)
    response = client.get("/", follow_redirects=False)

    assert response.status_code in (307, 308)
    assert response.headers.get("location")
    assert "http" in response.headers.get("location")
''',
    'tests/tests-backend/unit/test_db.py': '''import asyncio
from app.database.db import init_db, engine, get_session
from sqlalchemy.ext.asyncio import AsyncSession


def test_db_module_exports_session_functions():
    assert callable(init_db)
    assert hasattr(engine, "dispose")
    assert callable(get_session)


def test_get_session_returns_async_session():
    async def run_session():
        session_generator = get_session()
        session = await session_generator.__anext__()
        assert isinstance(session, AsyncSession)
        await session.close()
    asyncio.run(run_session())
''',
    'tests/tests-backend/unit/test_dependencies.py': '''import inspect
import pytest
from unittest.mock import AsyncMock
from app.routers.users.dependencies import (
    get_user_service,
    get_trip_service,
    get_trip_controller,
    get_driver_service,
    get_priority_engine,
)
from app.services.user_service import UserService
from app.services.trip_service import TripService
from app.services.driver_service import DriverService
from app.controllers.trip_controller import TripController


def test_dependency_factories_are_async_functions():
    assert inspect.iscoroutinefunction(get_user_service)
    assert inspect.iscoroutinefunction(get_trip_service)
    assert inspect.iscoroutinefunction(get_trip_controller)
    assert inspect.iscoroutinefunction(get_driver_service)
    assert inspect.iscoroutinefunction(get_priority_engine)


@pytest.mark.asyncio
async def test_user_and_driver_service_factories_return_expected_types():
    user_service = await get_user_service(AsyncMock())
    driver_service = await get_driver_service(AsyncMock())

    assert isinstance(user_service, UserService)
    assert isinstance(driver_service, DriverService)


@pytest.mark.asyncio
async def test_trip_controller_factory_returns_trip_controller():
    trip_service = await get_trip_service(AsyncMock())
    priority_engine = await get_priority_engine(AsyncMock())
    controller = await get_trip_controller(trip_service=trip_service, priority_engine=priority_engine)

    assert isinstance(controller, TripController)
    assert controller.trip_service is trip_service
    assert controller.priority_engine is priority_engine
''',
    'tests/tests-backend/unit/test_driver.py': '''import uuid
import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock
from app.services.driver_service import DriverService
from app.DTOs.driver import DriverPatchDTO
from app.enums.enums import UserProfile
from app.core.exceptions import BadRequestException, NotFoundException


def build_driver_patch_data():
    return DriverPatchDTO(
        full_name="Driver Name",
        email="driver@example.com",
        phone="11999999999",
        registration_id="20240001"
    )


@pytest.mark.asyncio
async def test_driver_update_raises_not_found_when_driver_missing():
    repository = AsyncMock()
    repository.get_by_id.return_value = None
    service = DriverService(repository)

    with pytest.raises(NotFoundException):
        await service.update_driver(uuid.uuid4(), build_driver_patch_data())


@pytest.mark.asyncio
async def test_driver_update_rejects_non_driver_profile():
    repository = AsyncMock()
    repository.get_by_id.return_value = SimpleNamespace(profile=UserProfile.STUDENT)
    service = DriverService(repository)

    with pytest.raises(BadRequestException):
        await service.update_driver(uuid.uuid4(), build_driver_patch_data())


@pytest.mark.asyncio
async def test_driver_update_calls_repository_for_valid_driver():
    repository = AsyncMock()
    driver = SimpleNamespace(profile=UserProfile.DRIVER)
    repository.get_by_id.return_value = driver
    repository.update_driver.return_value = {"updated": True}
    service = DriverService(repository)
    data = build_driver_patch_data()

    result = await service.update_driver(uuid.uuid4(), data)

    assert result == {"updated": True}
    repository.update_driver.assert_awaited_once_with(driver, data)
''',
    'tests/tests-backend/unit/test_email.py': '''import pytest
from unittest.mock import patch
from app.DTOs.email import RequestEmailChangeDTO
from app.services.email.use_cases import EmailUseCases
from app.core.exceptions import InternalServerException


def test_request_email_change_dto_validates_new_email():
    dto = RequestEmailChangeDTO(new_email="user@domain.com")
    assert dto.new_email == "user@domain.com"


def test_send_welcome_uses_template_and_email_service():
    with patch('app.services.email.use_cases.TemplateService') as mock_template_service, patch('app.services.email.use_cases.EmailService') as mock_email_service:
        mock_template_service.return_value.render.return_value = '<html>Welcome</html>'
        use_cases = EmailUseCases()

        use_cases.send_welcome('user@example.com', 'User', 'https://example.com')

        mock_template_service.return_value.render.assert_called_once_with(
            'welcome.html',
            {'name': 'User', 'link': 'https://example.com'}
        )
        mock_email_service.return_value.send.assert_called_once()


def test_send_recover_password_raises_internal_server_exception_on_template_failure():
    with patch('app.services.email.use_cases.EmailService'), patch('app.services.email.use_cases.TemplateService') as mock_template_service:
        mock_template_service.return_value.render.side_effect = Exception('render failed')
        use_cases = EmailUseCases()

        with pytest.raises(InternalServerException):
            use_cases.send_recover_password('user@example.com', 'User', 'token123')
''',
    'tests/tests-backend/unit/test_enums.py': '''from app.enums.enums import UserProfile, RegistrationStatus, BusStatus, TripStatus


def test_enums_have_expected_values():
    assert UserProfile.ADMIN.value == 'Admin'
    assert RegistrationStatus.PENDING.value == 'Pending'
    assert BusStatus.ACTIVE.value == 'Active'
    assert TripStatus.CANCELLED.value == 'Cancelled'
''',
    'tests/tests-backend/unit/test_exceptions.py': '''from app.core.exceptions import AppException, BadRequestException, NotFoundException, UnauthorizedException, ConflictException


def test_custom_exceptions_have_hierarchy():
    assert issubclass(BadRequestException, AppException)
    assert issubclass(NotFoundException, AppException)
    assert issubclass(UnauthorizedException, AppException)
    assert issubclass(ConflictException, AppException)
''',
}
for path, content in test_files.items():
    Path(path).write_text(content, encoding='utf-8')
print(f'Wrote {len(test_files)} files')
