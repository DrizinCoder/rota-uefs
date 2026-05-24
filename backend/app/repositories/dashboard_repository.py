import uuid
from datetime import date
from sqlalchemy import and_, select, func, case, distinct
from sqlalchemy.orm import aliased
from app.models.models import Bus, Reservation, Route, Trip, User
from app.DTOs.reports import PassengerInsuranceItem, TripInsuranceReportDTO
from app.enums.enums import BoardingStatus, BusStatus
from sqlalchemy.ext.asyncio import AsyncSession

class DashboardRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_dashboard(self, target_date: date):
        
        bus_totals_stmt = select(
            func.count(Bus.bus_plate).label("total_buses"),
            func.sum(
                case((Bus.bus_status == BusStatus.ACTIVE, 1), else_=0)
            ).label("active_buses")
        )
        bus_totals = (await self.session.execute(bus_totals_stmt)).first()

        trips_total_stmt = select(
            func.count(Trip.trip_id).label("total_trips_today")
        ).where(Trip.trip_date == target_date)
        total_trips_today = (await self.session.execute(trips_total_stmt)).scalar() or 0

        totals = {
            "total_buses": bus_totals.total_buses or 0,
            "active_buses": bus_totals.active_buses or 0,
            "total_trips_today": total_trips_today
        }

        buses_stmt = (
            select(
                Bus.bus_plate,
                Bus.capacity,
                Bus.bus_status,
                func.count(Trip.trip_id).label("trips_today")
            )
            .outerjoin(
                Trip, 
                and_(
                    Bus.bus_plate == Trip.bus_license_plate,
                    Trip.trip_date == target_date
                )
            )
            .group_by(Bus.bus_plate, Bus.capacity, Bus.bus_status)
        )
        
        buses = (await self.session.execute(buses_stmt)).all()

        return totals, buses
    
    async def get_trip_insurance_data(self, trip_id: uuid.UUID) -> TripInsuranceReportDTO | None:
        DriverUser = aliased(User)

        trip_statement = (
            select(
                Trip.trip_id,
                Trip.trip_date,
                Trip.departure_time,
                Trip.bus_license_plate,
                Route.boarding_point,
                Route.drop_off_point,
                DriverUser.full_name.label("driver_name")
            )
            .join(Route, Route.route_id == Trip.route_id)
            .join(DriverUser, DriverUser.user_id == Trip.driver_id)
            .where(Trip.trip_id == trip_id)
        )

        trip_result = await self.session.execute(trip_statement)
        trip_row = trip_result.first()

        if not trip_row:
            return None
        
        passengers_statement = (
            select(
                User.full_name,
                User.email,
                User.registration_id,
                User.profile.label("user_role")
            )
            .join(Reservation, Reservation.user_id == User.user_id)
            .where(
                Reservation.trip_id == trip_id,
                Reservation.boarding_confirmation == BoardingStatus.BOARDED
            )
            .order_by(User.full_name)
        )

        passengers_result = await self.session.execute(passengers_statement)
        passengers_rows = passengers_result.all()

        passenger_list = [
            PassengerInsuranceItem(
                name=p.full_name,
                email=p.email,
                registration_id=str(p.registration_id),
                user_role=p.user_role
            )
            for p in passengers_rows
        ]

        return TripInsuranceReportDTO(
            trip_id=trip_row.trip_id,
            trip_date=trip_row.trip_date,
            departure_time=trip_row.departure_time,
            bus_license_plate=trip_row.bus_license_plate,
            driver_name=trip_row.driver_name,
            boarding_point=trip_row.boarding_point,
            drop_off_point=trip_row.drop_off_point,
            total_passengers=len(passenger_list),
            passengers=passenger_list
        )