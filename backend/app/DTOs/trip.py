import uuid
from datetime import date, time
from typing import Optional
from sqlmodel import SQLModel
from app.enums.enums import TripStatus

class CreateTripDTO(SQLModel):
    bus_license_plate: str
    driver_id: uuid.UUID
    route_id: uuid.UUID
    trip_date: date
    departure_time: time

class UpdateTripDTO(SQLModel):
    bus_license_plate: Optional[str] = None
    driver_id: Optional[uuid.UUID] = None
    route_id: Optional[uuid.UUID] = None
    trip_date: Optional[date] = None
    departure_time: Optional[time] = None
    status: Optional[TripStatus] = None