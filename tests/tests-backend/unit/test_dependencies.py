import inspect
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
