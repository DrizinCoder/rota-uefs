from decimal import Decimal
import uuid

from datetime import time
from datetime import date
from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.enums.enums import UserProfile, AccessLevel, BoardingStatus, BusStatus, EmploymentType, PassengerType, RegistrationStatus, TripStatus

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

    staff_member: Optional["Staff"] = Relationship(
        back_populates="user", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    admin_member: Optional["Admin"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    reservations: List["Reservation"] = Relationship(back_populates="user")

    push_subscriptions: List["PushSubscription"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

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
    logs: List["AuditLog"] = Relationship(back_populates="admin")
    
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
    city_of_origin: Optional[str]
    destination_city: Optional[str]
    boarding_latitude: Optional[Decimal] = Field(default=None, max_digits=10, decimal_places=7)
    boarding_longitude: Optional[Decimal] = Field(default=None, max_digits=11, decimal_places=7)
    drop_off_latitude: Optional[Decimal] = Field(default=None, max_digits=10, decimal_places=7)
    drop_off_longitude: Optional[Decimal] = Field(default=None, max_digits=11, decimal_places=7)

class AuditLog(SQLModel, table=True):
    log_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    action: str
    timestamp: datetime = Field(default_factory=datetime.now)

    admin_id: uuid.UUID = Field(foreign_key="admin.admin_id")
    admin: "Admin" = Relationship(back_populates="logs")

class Trip(SQLModel, table=True):
    trip_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True
    )
    
    bus_license_plate: str = Field(foreign_key="bus.bus_plate")
    
    driver_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=Column(
            UUID(as_uuid=True),
            ForeignKey("user.user_id", ondelete="SET NULL"),
            nullable=True
        )
    )
    route_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=Column(
            UUID(as_uuid=True),
            ForeignKey("route.route_id", ondelete="SET NULL"),
            nullable=True
        )
    )
    
    trip_date: date
    departure_time: time
    status: TripStatus = Field(default=TripStatus.PENDING)

    reservations: list["Reservation"] = Relationship(back_populates="trip")
    driver: Optional["User"] = Relationship(
        sa_relationship_kwargs={"passive_deletes": True}
    )
    route: Optional["Route"] = Relationship(
        sa_relationship_kwargs={"passive_deletes": True}
    )

class Reservation(SQLModel, table=True):
    reservation_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True
    )
    
    user_id: uuid.UUID = Field(foreign_key="user.user_id")
    trip_id: uuid.UUID = Field(foreign_key="trip.trip_id")
    
    extra_passenger_name: Optional[str] = Field(default=None) 
    
    boarding_confirmation: BoardingStatus = Field(default=BoardingStatus.NOT_BOARDED)
    boarding_timestamp: Optional[datetime] = Field(default=None)

    reservation_timestamp: datetime = Field(default_factory=datetime.now)

    trip: Trip = Relationship(back_populates="reservations")
    user: User = Relationship(back_populates="reservations")

class PushSubscription(SQLModel, table=True):
    subscription_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        index=True,
        nullable=False
    )
    
    user_id: uuid.UUID = Field(foreign_key="user.user_id")
    endpoint: str = Field(unique=True)
    p256dh: str
    auth: str

    user: User = Relationship(back_populates="push_subscriptions")