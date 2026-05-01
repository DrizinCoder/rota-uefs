from datetime import date
from app.services.dashboard_service import DashboardService
import logging

logger = logging.getLogger(__name__)

class DashboardController:
    def __init__(self, service: DashboardService):
        self.service = service

    async def get_home_info(self, today: date):
        logger.info(f"Dashboard info requested | Today: {today}")

        result = await self.service.get_home_info(today)

        logger.info(f"Dashboard info retrieved successfully | Trips today: {len(result.get('trips_today', []))}")
        
        return result