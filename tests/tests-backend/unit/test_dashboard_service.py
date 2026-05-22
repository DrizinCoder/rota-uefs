import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from app.core.exceptions import NotFoundException
from app.services.dashboard_service import DashboardService


def test_get_home_info_transforms_repository_data():
    repository = AsyncMock()
    repository.get_dashboard.return_value = ({'total_buses': 1, 'active_buses': 1, 'total_trips_today': 2}, [SimpleNamespace(bus_plate='ABC1234', capacity=40, bus_status='Active', trips_today=3)])
    service = DashboardService(repository)

    response = asyncio.run(service.get_home_info(None))

    assert response['summary']['total_buses'] == 1
    assert response['buses'][0]['plate'] == 'ABC1234'


def test_get_home_info_raises_when_no_totals():
    repository = AsyncMock()
    repository.get_dashboard.return_value = (None, [])
    service = DashboardService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.get_home_info(None))
