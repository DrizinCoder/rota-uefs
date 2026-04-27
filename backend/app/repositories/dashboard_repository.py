import uuid
from datetime import date
from sqlalchemy import and_, select, func, case, distinct
from app.models.models import Bus, Trip
from app.enums.enums import BusStatus
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