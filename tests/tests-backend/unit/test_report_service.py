import asyncio
import uuid
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from app.core.exceptions import NotFoundException
from app.services.dashboard_service import DashboardService


def test_get_trip_report_returns_report():
    repository = AsyncMock()
    expected_report = SimpleNamespace(report_id=uuid.uuid4())
    repository.get_trip_insurance_data.return_value = expected_report
    service = DashboardService(repository)

    result = asyncio.run(service.get_trip_report(uuid.uuid4()))

    assert result is expected_report


def test_get_trip_report_raises_not_found():
    repository = AsyncMock()
    repository.get_trip_insurance_data.return_value = None
    service = DashboardService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.get_trip_report(uuid.uuid4()))


def test_get_monthly_report_returns_report():
    repository = AsyncMock()
    expected_report = SimpleNamespace(report_id=uuid.uuid4())
    repository.get_monthly_trip_insurance_data.return_value = expected_report
    service = DashboardService(repository)

    result = asyncio.run(service.get_monthly_report(__import__('datetime').date(2026, 6, 1)))

    assert result is expected_report


def test_get_monthly_report_raises_not_found():
    repository = AsyncMock()
    repository.get_monthly_trip_insurance_data.return_value = None
    service = DashboardService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.get_monthly_report(__import__('datetime').date(2026, 6, 1)))
