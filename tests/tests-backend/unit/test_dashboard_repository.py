import asyncio
from datetime import date
from unittest.mock import AsyncMock, MagicMock

from app.repositories.dashboard_repository import DashboardRepository


def test_get_dashboard_returns_totals_and_buses():
    session = AsyncMock()
    totals_result = MagicMock()
    totals_result.first.return_value = MagicMock(total_buses=2, active_buses=1)
    trips_result = MagicMock()
    trips_result.scalar.return_value = 5
    buses_result = MagicMock()
    buses_result.all.return_value = [('ABC1234', 40, 'Active', 3)]

    session.execute.side_effect = [totals_result, trips_result, buses_result]

    repository = DashboardRepository(session)
    totals, buses = asyncio.run(repository.get_dashboard(date(2026, 5, 1)))

    assert totals['total_buses'] == 2
    assert totals['active_buses'] == 1
    assert totals['total_trips_today'] == 5
    assert buses == [('ABC1234', 40, 'Active', 3)]
