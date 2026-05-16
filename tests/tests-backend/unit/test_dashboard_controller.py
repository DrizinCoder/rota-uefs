import pytest
from datetime import date
from types import SimpleNamespace
from app.controllers.dashboard_controller import DashboardController
from app.services.dashboard_service import DashboardService
from app.core.exceptions import NotFoundException


class DummyDashboardRepository:
    async def get_dashboard(self, today):
        return (
            {"total_buses": 1, "active_buses": 1, "total_trips_today": 2},
            [SimpleNamespace(bus_plate="BUS123", capacity=30, bus_status="Active", trips_today=2)]
        )


class EmptyDashboardRepository:
    async def get_dashboard(self, today):
        return None, []


@pytest.mark.asyncio
async def test_dashboard_controller_get_home_info_returns_summary_and_buses():
    repository = DummyDashboardRepository()
    service = DashboardService(repository)
    controller = DashboardController(service)

    result = await controller.get_home_info(date.today())

    assert result["summary"]["total_buses"] == 1
    assert result["summary"]["active_buses"] == 1
    assert result["summary"]["total_trips_today"] == 2
    assert result["buses"][0]["plate"] == "BUS123"
    assert result["buses"][0]["capacity"] == 30
    assert result["buses"][0]["status"] == "Active"


@pytest.mark.asyncio
async def test_dashboard_controller_raises_not_found_when_no_data():
    repository = EmptyDashboardRepository()
    service = DashboardService(repository)
    controller = DashboardController(service)

    with pytest.raises(NotFoundException):
        await controller.get_home_info(date.today())
