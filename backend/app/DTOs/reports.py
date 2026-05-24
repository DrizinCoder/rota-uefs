import uuid
from datetime import date, time
from pydantic import BaseModel
from typing import List
from app.enums.enums import BoardingStatus, UserProfile

class PassengerInsuranceItem(BaseModel):
    name: str
    email: str
    registration_id: str
    user_role: UserProfile
    boarding_status: BoardingStatus

class TripInsuranceReportDTO(BaseModel):
    trip_id: uuid.UUID
    trip_date: date
    departure_time: time
    bus_license_plate: str
    driver_name: str
    boarding_point: str
    drop_off_point: str
    total_passengers: int
    total_reservations: int = 0
    passengers: List[PassengerInsuranceItem]
    
    @property
    def boarding_conversion_rate(self) -> str:
        if self.total_reservations == 0:
            return "0%"
        rate = (self.total_passengers / self.total_reservations) * 100
        return f"{rate:.1f}%"