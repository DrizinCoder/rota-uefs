from app.enums.enums import BoardingStatus
from sqlmodel import SQLModel, Field
from typing import Optional
from decimal import Decimal
class CreateRouteDTO(SQLModel):
    name: str
    boarding_point: str
    drop_off_point: str
    city_of_origin: Optional[str] = None
    destination_city: Optional[str] = None
    boarding_latitude: Optional[Decimal] = None
    boarding_longitude: Optional[Decimal] = None
    drop_off_latitude: Optional[Decimal] = None
    drop_off_longitude: Optional[Decimal] = None

class UpdateRouteDTO(SQLModel):
    name: Optional[str] = None
    boarding_point: Optional[str] = None
    drop_off_point: Optional[str] = None
    city_of_origin: Optional[str] = None
    destination_city: Optional[str] = None
    boarding_latitude: Optional[Decimal] = None
    boarding_longitude: Optional[Decimal] = None
    drop_off_latitude: Optional[Decimal] = None
    drop_off_longitude: Optional[Decimal] = None
