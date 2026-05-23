import uuid
from datetime import date, time
from pydantic import BaseModel
from typing import List
from app.enums.enums import UserProfile

class PassengerInsuranceItem(BaseModel):
    name: str
    email: str
    registration_id: str
    user_role: UserProfile

class TripInsuranceReportDTO(BaseModel):
    trip_id: uuid.UUID
    trip_date: date
    departure_time: time
    bus_license_plate: str
    driver_name: str
    boarding_point: str
    drop_off_point: str
    total_passengers: int
    passengers: List[PassengerInsuranceItem]