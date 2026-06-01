from app.DTOs.trip import WEEKDAY_PT
from app.DTOs.trip import PassengerTripItem
from app.utils.utils import add_ninety_minutes
from app.DTOs.trip import TripDetailFeedItem
from typing import Optional
from sqlalchemy.orm import joinedload, selectinload
import uuid
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select
from app.models.models import Trip
from app.enums.enums import TripStatus
from app.DTOs.trip import CreateTripDTO, UpdateTripDTO, DriverTripItem
from sqlmodel import select, func, and_
from app.models.models import Trip, Route, Bus, Reservation, User
from app.enums.enums import UserProfile, BoardingStatus
from app.DTOs.trip import TripFeedItem
from sqlalchemy import case

class TripRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all_reservations(self):
        stmt = select(Reservation).options(joinedload(Reservation.user))
        result = await self.session.execute(stmt)
        return result.scalars().all()   

    async def create(self, data: CreateTripDTO):
        trip = Trip(
            bus_license_plate=data.bus_license_plate,
            driver_id=data.driver_id,
            route_id=data.route_id,
            trip_date=data.trip_date,
            departure_time=data.departure_time,
            status=TripStatus.PENDING
        )
        self.session.add(trip)
        await self.session.commit()
        await self.session.refresh(trip)
        return trip

    async def get_bus_capacity_and_total_reservations_by_trip_id(self, trip_id: uuid.UUID):
        stmt = (
            select(
                Bus.capacity,
                func.count(Reservation.reservation_id).label("total_reservations")
            )
            .select_from(Trip)
            .join(Bus, Trip.bus_license_plate == Bus.bus_plate)
            .outerjoin(Reservation, Trip.trip_id == Reservation.trip_id)
            .where(Trip.trip_id == trip_id)
            .group_by(Trip.trip_id, Bus.capacity)
        )
        
        result = await self.session.execute(stmt)
        
        return result.first()

    async def get_all(self):
        statement = (
            select(Trip)
            .options(
                selectinload(Trip.driver),
                selectinload(Trip.route)
            )
        )

        result = await self.session.execute(statement)
        trips = result.scalars().all()

        return [
            {
                **trip.model_dump(mode='json'),
                "driver_name": trip.driver.full_name if trip.driver else None,
                "route_name": trip.route.name if trip.route else None,
                "boarding_point": trip.route.boarding_point if trip.route else None,
                "drop_off_point": trip.route.drop_off_point if trip.route else None,
            }
            for trip in trips
        ]

    async def get_all_with_reservation(self):
        statement = (
        select(Trip)
        .options(
            selectinload(Trip.driver),
            selectinload(Trip.route),
            selectinload(Trip.reservations).selectinload(Reservation.user)
        )
    )

        result = await self.session.execute(statement)
        trips = result.scalars().all()

        return [
            {
                **trip.model_dump(mode='json'),
                "driver_name": trip.driver.full_name if trip.driver else None,
                "route_name": trip.route.name if trip.route else None,
                "boarding_point": trip.route.boarding_point if trip.route else None,
                "drop_off_point": trip.route.drop_off_point if trip.route else None,
                
                "total_reservations": len(trip.reservations),
                
                "total_checkins": sum(
                    1 for res in trip.reservations 
                    if res.boarding_confirmation == BoardingStatus.BOARDED
                ),
                
                "teachers_count": sum(
                    1 for res in trip.reservations 
                    if res.user and res.user.profile in [UserProfile.STAFF]
                ),
                
                "students_count": sum(
                    1 for res in trip.reservations 
                    if res.user and res.user.profile == UserProfile.STUDENT
                ),
            }
            for trip in trips
        ]

    async def cancel_trip(self, trip_id: str):
        trip = await self.get_by_id(trip_id)
        if not trip:
            return None
        
        trip.status = TripStatus.CANCELLED
        self.session.add(trip)
        await self.session.commit()
        await self.session.refresh(trip)
        return trip

    async def get_by_id(self, trip_id: uuid.UUID):
        statement = (
            select(Trip)
            .where(Trip.trip_id == trip_id)
            .options(selectinload(Trip.route))
        )
        
        result = await self.session.execute(statement)
        return result.scalars().first()

    async def get_by_date(self, trip_date: date):
        statement = select(Trip).where(Trip.trip_date == trip_date)
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def patch(self, trip_id: uuid.UUID, data: UpdateTripDTO):
        trip = await self.get_by_id(trip_id)
        if not trip:
            return None

        update_dict = data.model_dump(exclude_unset=True)
        trip.sqlmodel_update(update_dict)

        self.session.add(trip)
        await self.session.commit()
        await self.session.refresh(trip)
        return trip

    async def delete(self, trip_id: uuid.UUID):
        trip = await self.get_by_id(trip_id)
        if not trip:
            return None
        await self.session.delete(trip)
        await self.session.commit()
        return trip
    
    async def get_all_users_with_reservation_active_by_trip_id(self, trip_id: str) -> list[User]:
        stmt = (
            select(User)
            .join(Reservation, Reservation.user_id == User.user_id)
            .where(Reservation.trip_id == trip_id)
            .where(Reservation.status == "not_boarded")
        )

        result = await self.session.execute(stmt)
        return result.scalars().all()
    
    async def get_trips_for_feed_by_date_range(
        self, start_date: date, end_date: date, driver_id: str | None = None,
    ) -> list[TripFeedItem]:

        student_count_expr = func.sum(
            case((User.profile == UserProfile.STUDENT, 1), else_=0)
        ).label("student_count")

        staff_count_expr = func.sum(
            case((User.profile == UserProfile.STAFF, 1), else_=0)
        ).label("staff_count")

        statement = (
            select(
                Trip.trip_id,
                Trip.trip_date,
                Route.boarding_point,
                Route.drop_off_point,
                Trip.departure_time,
                func.coalesce(student_count_expr, 0).label("student_count"),
                func.coalesce(staff_count_expr, 0).label("staff_count"),
                Bus.capacity.label("bus_capacity"),
            )
            .join(Route, Route.route_id == Trip.route_id)
            .join(Bus, Bus.bus_plate == Trip.bus_license_plate)
            .outerjoin(Reservation, Reservation.trip_id == Trip.trip_id)
            .outerjoin(User, User.user_id == Reservation.user_id)
            .where(Trip.trip_date.between(start_date, end_date))
        )

        if driver_id is not None:  # 👈
            statement = statement.where(Trip.driver_id == driver_id)
        
        statement  = statement.group_by(
                Trip.trip_id,
                Trip.trip_date,
                Route.boarding_point,
                Route.drop_off_point,
                Trip.departure_time,
                Bus.capacity,
            ).order_by(Trip.trip_date, Trip.departure_time)

        result = await self.session.execute(statement)
        rows = result.all()

        return [
            TripFeedItem(
                trip_id=row.trip_id,
                weekday=WEEKDAY_PT[row.trip_date.weekday()],
                boarding_point=row.boarding_point,
                drop_off_point=row.drop_off_point,
                departure_time=row.departure_time,
                student_count=row.student_count,
                staff_count=row.staff_count,
                bus_capacity=row.bus_capacity,
                total_enrolled=row.student_count + row.staff_count,
            )
            for row in rows
        ]
        
    async def get_trip_detail_for_feed(self, trip_id: uuid.UUID) -> Optional[TripDetailFeedItem]:
        student_count_sq = (
            select(func.count(Reservation.reservation_id))
            .join(User, User.user_id == Reservation.user_id)
            .where(
                Reservation.trip_id == trip_id,
                User.profile == UserProfile.STUDENT,
            )
            .scalar_subquery()
        )

        staff_count_sq = (
            select(func.count(Reservation.reservation_id))
            .join(User, User.user_id == Reservation.user_id)
            .where(
                Reservation.trip_id == trip_id,
                User.profile == UserProfile.STAFF,
            )
            .scalar_subquery()
        )

        statement = (
            select(
                Trip.trip_id,
                Trip.route_id,
                Trip.status.label("trip_status"),
                Trip.departure_time,
                Route.boarding_point,
                Route.drop_off_point,
                Bus.capacity.label("bus_capacity"),
                User.full_name.label("driver_name"),
                Trip.bus_license_plate.label("bus_plate"),
                student_count_sq.label("student_count"),
                staff_count_sq.label("staff_count"),
            )
            .join(Route, Route.route_id == Trip.route_id)
            .join(Bus, Bus.bus_plate == Trip.bus_license_plate)
            .join(User, User.user_id == Trip.driver_id)
            .where(Trip.trip_id == trip_id)
        )

        result = await self.session.execute(statement)
        row = result.first()

        if not row:
            return None

        return TripDetailFeedItem(
            trip_id=row.trip_id,
            route_id=row.route_id,
            trip_status=row.trip_status,
            boarding_point=row.boarding_point,
            drop_off_point=row.drop_off_point,
            departure_time=row.departure_time,
            estimated_arrival=add_ninety_minutes(row.departure_time),
            bus_capacity=row.bus_capacity,
            total_enrolled=row.student_count + row.staff_count,
            student_count=row.student_count,
            staff_count=row.staff_count,
            driver_name=row.driver_name,
            bus_plate=row.bus_plate,
        )
    
    async def get_trips_by_user_id(self, user_id: uuid.UUID) -> list[PassengerTripItem]:
        today = date.today()

        statement = (
            select(
                Trip.trip_id,
                Trip.trip_date,
                Trip.departure_time,
                Route.boarding_point,
                Route.drop_off_point,
            )
            .join(Route, Route.route_id == Trip.route_id)
            .join(Reservation, Reservation.trip_id == Trip.trip_id)
            .where(Reservation.user_id == user_id)
            .order_by(Trip.trip_date, Trip.departure_time)
        )

        result = await self.session.execute(statement)
        rows = result.all()

        return [
            PassengerTripItem(
                trip_id=row.trip_id,
                boarding_point=row.boarding_point,
                drop_off_point=row.drop_off_point,
                trip_date=row.trip_date,
                departure_time=row.departure_time,
                reference_date=today,
            )
            for row in rows
        ]
    
    async def get_all_trips_and_reservations_by_user_id(self, user_id: uuid.UUID) -> list[dict]:
        statement = (
            select(
                Trip.trip_id,   
                Trip.trip_date,
                Trip.departure_time,
                Trip.status,    
                Route.boarding_point,
                Route.drop_off_point,
                Reservation.reservation_id,
                Reservation.boarding_confirmation,
                Reservation.extra_passenger_name,
                Reservation.boarding_timestamp
            )       
            .join(Route, Route.route_id == Trip.route_id)
            .join(Reservation, Reservation.trip_id == Trip.trip_id)
            .where(Reservation.user_id == user_id)  
            .order_by(Trip.trip_date, Trip.departure_time)
        )

        result = await self.session.execute(statement)
        rows = result.all()         
        trips_dict = {}
        for row in rows:
            trip_id = row.trip_id
            if trip_id not in trips_dict:
                trips_dict[trip_id] = {
                    "trip_id": row.trip_id,
                    "trip_date": row.trip_date,
                    "departure_time": row.departure_time,
                    "status": row.status,
                    "boarding_point": row.boarding_point,
                    "drop_off_point": row.drop_off_point,
                    "reservations": []
                }
            trips_dict[trip_id]["reservations"].append({
                "reservation_id": row.reservation_id,
                "boarding_confirmation": row.boarding_confirmation,
                "extra_passenger_name": row.extra_passenger_name,
                "boarding_timestamp": row.boarding_timestamp
            })

        return list(trips_dict.values())    
     
    
    async def get_trips_by_driver_id(self, driver_id: uuid.UUID) -> list[DriverTripItem]:
        statement = (
            select(
                Trip.trip_id,
                Trip.trip_date,
                Trip.departure_time,
                Trip.status,
                Trip.bus_license_plate,
                Route.boarding_point,
                Route.drop_off_point,
                Bus.capacity.label("bus_capacity"),
                func.count(Reservation.reservation_id).label("confirmed_passengers")
            )
            .join(Route, Route.route_id == Trip.route_id)
            .join(Bus, Bus.bus_plate == Trip.bus_license_plate)
            .outerjoin(
                Reservation, 
                and_(
                    Reservation.trip_id == Trip.trip_id,
                    Reservation.boarding_confirmation != BoardingStatus.CANCELLED
                )
            )
            .where(Trip.driver_id == driver_id)
            .group_by(
                Trip.trip_id,
                Trip.trip_date,
                Trip.departure_time,
                Trip.status,
                Trip.bus_license_plate,
                Route.boarding_point,
                Route.drop_off_point,
                Bus.capacity
            )
            .order_by(Trip.trip_date, Trip.departure_time)
        )
        
        result = await self.session.execute(statement)
        rows = result.all()
        
        return [
            DriverTripItem(
                trip_id=row.trip_id,
                trip_date=row.trip_date,
                departure_time=row.departure_time,
                status=row.status,
                bus_license_plate=row.bus_license_plate,
                boarding_point=row.boarding_point,
                drop_off_point=row.drop_off_point,
                bus_capacity=row.bus_capacity,
                confirmed_passengers=row.confirmed_passengers,
            )
            for row in rows
        ]
    
    async def update_status(self, trip: Trip, new_status: TripStatus) -> Trip:
        trip.status = new_status
        await self.session.commit()
        await self.session.refresh(trip)
        return trip