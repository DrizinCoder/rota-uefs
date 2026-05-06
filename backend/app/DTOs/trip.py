from pydantic import BaseModel
from app.enums.enums import TripRecurrence
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
    recurrence: TripRecurrence = TripRecurrence.SINGLE

class UpdateTripDTO(SQLModel):
    bus_license_plate: Optional[str] = None
    driver_id: Optional[uuid.UUID] = None
    route_id: Optional[uuid.UUID] = None
    trip_date: Optional[date] = None
    departure_time: Optional[time] = None
    status: Optional[TripStatus] = None

class TripFeedItem(BaseModel):
    trip_id: uuid.UUID
    trip_date: date  
    boarding_point: str
    drop_off_point: str
    departure_time: time
    student_count: int
    staff_count: int
    bus_capacity: int
    total_enrolled: int

class TripFeedResponse(BaseModel):
    reference_date: date
    trips: list[TripFeedItem]

class TripDetailFeedItem(BaseModel):
    trip_id: uuid.UUID
    route_id: uuid.UUID
    trip_status: TripStatus
    boarding_point: str
    drop_off_point: str
    departure_time: time
    estimated_arrival: time
    bus_capacity: int
    total_enrolled: int
    student_count: int
    staff_count: int
    driver_name: str
    bus_plate: str

class PassengerTripItem(BaseModel):
    trip_id: uuid.UUID
    boarding_point: str
    drop_off_point: str
    trip_date: date
    departure_time: time
    reference_date: date