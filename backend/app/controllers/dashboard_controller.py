import base64
from datetime import date, datetime
import uuid
from app.services.dashboard_service import DashboardService
from app.services.reports.weasyprint_generator import WeasyPrintGenerator
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
    
    async def trip_report(self, trip_id: uuid.UUID):
        try:
            report = await self.service.get_trip_report(trip_id)
            log_data = {'timestamp':datetime.now(),'title':'trip_report'}
            bytes = WeasyPrintGenerator().generate_pdf('insurance_report.html', report, log_data)

            return base64.b64encode(bytes)

        except Exception as e:
            logger.error(f"Error generating trip report {trip_id}: {e}")
            raise