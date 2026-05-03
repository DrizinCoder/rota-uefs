from app.core.exceptions import NotFoundException
from datetime import date
from app.repositories.dashboard_repository import DashboardRepository
import logging

logger = logging.getLogger(__name__)


class DashboardService:
    def __init__(self, repository: DashboardRepository):
        self.repository = repository

    async def get_home_info(self, today: date):
        logger.info(f"Dashboard service info requested | Today: {today}")

        totals, buses = await self.repository.get_dashboard(today)
        if not totals:
            raise NotFoundException("Nenhuma informação encontrada")

        logger.info(f"Dashboard service info retrieved successfully | Buses: {len(buses)}")
        return {
            "summary": {
                "total_buses": totals.get("total_buses"),
                "active_buses": totals.get("active_buses"),
                "total_trips_today": totals.get("total_trips_today") or 0
            },
            "buses": [
                {
                    "plate": bus.bus_plate,
                    "capacity": bus.capacity,
                    "status": bus.bus_status,
                    "trips_today": bus.trips_today
                }
                for bus in buses
            ]
        }