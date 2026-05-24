import base64
from datetime import date, datetime
from typing import List
import uuid
from app.DTOs.reports import TripInsuranceReportDTO
from app.services.dashboard_service import DashboardService
from app.services.reports.weasyprint_generator import WeasyPrintGenerator
from app.services.reports.csv_generator import CsvGenerator
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
    
    async def trip_report_PDF(self, reports: List[TripInsuranceReportDTO], title: str) -> str:
        log_data = {'timestamp': datetime.now(), 'title': title}
        context = {"reports": reports}
        pdf_bytes = WeasyPrintGenerator().generate_pdf('insurance_report.html', context, log_data)
        return base64.b64encode(pdf_bytes)
    
    async def trip_report_CSV(self, reports: List[TripInsuranceReportDTO], title: str) -> str:
        headers = [
            "trip_id", "trip_date", "departure_time", "bus_license_plate", 
            "driver_name", "boarding_point", "drop_off_point",
            "name", "email", "registration_id", "user_role", "boarding_status"
        ]

        dados = []

        for report in reports:
            for passenger in report.passengers:
                row = {
                    "trip_id": str(report.trip_id),
                    "trip_date": str(report.trip_date),
                    "departure_time": str(report.departure_time),
                    "bus_license_plate": report.bus_license_plate,
                    "driver_name": report.driver_name,
                    "boarding_point": report.boarding_point,
                    "drop_off_point": report.drop_off_point,
                    **passenger.model_dump() 
                }
                dados.append(row)

        csv_bytes = CsvGenerator().generate_csv(dados, headers)
        return base64.b64encode(csv_bytes)

    async def trip_report(self, trip_id: uuid.UUID, file_format: str):
        file_format = file_format.lower()
        try:

            generators = {
                "pdf": self.trip_report_PDF,
                "csv": self.trip_report_CSV
            }
            
            if file_format not in generators:
                raise ValueError("Formato não suportado")
            
            report = await self.service.get_trip_report(trip_id)
            
            generate_report = generators[file_format]
            return await generate_report([report], 'Relatório de viagem')
        
        except Exception as e:
            logger.error(f"Error generating trip report {trip_id}: {e}")
            raise

    async def monthly_report(self, month: date, file_format: str):
        file_format = file_format.lower()
        try:

            generators = {
                "pdf": self.trip_report_PDF,
                "csv": self.trip_report_CSV
            }
            
            if file_format not in generators:
                raise ValueError("Formato não suportado")
            
            report = await self.service.get_monthly_report(month)
            
            generate_report = generators[file_format]
            return await generate_report(report, 'Relatório Mensal')
        
        except Exception as e:
            logger.error(f"Error generating monthly report {month}: {e}")
            raise