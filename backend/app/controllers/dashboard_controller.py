from datetime import date
from app.services.dashboard_service import DashboardService

class DashboardController:
    def __init__(self, service: DashboardService):
        self.service = service

    async def get_home_info(self, today: date):
        return await self.service.get_home_info(today)