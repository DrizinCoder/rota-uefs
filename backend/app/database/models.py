from app.database.enums import TripStatus
from datetime import time
from datetime import date
from app.database.enums import BoardingStatus
from app.database.enums import PassengerType
from datetime import datetime
from app.database.enums import BusStatus
from app.database.enums import RegistrationStatus
from app.database.enums import UserProfile
from app.database.enums import AccessLevel
from app.database.enums import EmploymentType
import uuid
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    user_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    full_name: str
    password: str
    registration_id: str = Field(unique=True)
    phone: str
    email: Optional[str] = Field(default=None, unique=True)
    profile: UserProfile
    registration_status: RegistrationStatus = Field(default=RegistrationStatus.PENDING)
    is_anonymized: bool = Field(default=False) 

    staff_member: Optional["Staff"] = Relationship(back_populates="user")
    admin_member: Optional["Admin"] = Relationship(back_populates="user")
    reservations: List["Reservation"] = Relationship(back_populates="user")

class Staff(SQLModel, table=True):
    staff_id: uuid.UUID = Field(
        foreign_key="user.user_id", 
        primary_key=True
    )
    employment_type: EmploymentType
    department: str

    user: "User" = Relationship(back_populates="staff_member")

class Admin(SQLModel, table=True):
    admin_id: uuid.UUID = Field(
        foreign_key="user.user_id", 
        primary_key=True
    )
    access_level: AccessLevel

    user: "User" = Relationship(back_populates="admin_member")
    
class Bus(SQLModel, table=True):
    bus_plate: str = Field(primary_key=True, index=True, nullable=False)
    capacity: int
    bus_status: BusStatus

class Route(SQLModel, table=True):
    route_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    name: str
    boarding_point: str
    drop_off_point: str

class AuditLog(SQLModel, table=True):
    log_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    action: str
    timestamp: datetime = Field(default_factory=datetime.now)

class Trip(SQLModel, table=True):
    trip_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True
    )
    
    bus_license_plate: str = Field(foreign_key="bus.bus_plate")
    driver_id: uuid.UUID = Field(foreign_key="user.user_id")
    route_id: uuid.UUID = Field(foreign_key="route.route_id")
    
    trip_date: date
    departure_time: time
    status: TripStatus = Field(default=TripStatus.PENDING)

    reservations: list["Reservation"] = Relationship(back_populates="trip")

class Reservation(SQLModel, table=True):
    reservation_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True
    )
    
    user_id: Optional[uuid.UUID] = Field(default=None, foreign_key="user.user_id")
    trip_id: uuid.UUID = Field(foreign_key="trip.trip_id")
    
    passenger_type: PassengerType
    extra_passenger_name: Optional[str] = Field(default=None) 
    
    boarding_confirmation: BoardingStatus = Field(default=BoardingStatus.NOT_BOARDED)
    confirmation_code: str = Field(unique=True, index=True)
    boarding_timestamp: Optional[datetime] = Field(default=None)

    trip: Trip = Relationship(back_populates="reservations")
    user: Optional["User"] = Relationship()
