import uuid
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select
from app.models.models import Trip
from app.enums.enums import TripStatus
from app.DTOs.trip import CreateTripDTO, UpdateTripDTO

class TripRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

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

    async def get_all(self):
        statement = select(Trip)
        result = await self.session.execute(statement)
        return result.scalars().all()

    async def get_by_id(self, trip_id: uuid.UUID):
        statement = select(Trip).where(Trip.trip_id == trip_id)
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