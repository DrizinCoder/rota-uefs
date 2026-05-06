from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert 
from app.models.models import Reservation
from app.enums.enums import BoardingStatus

class ReservationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, user_id: str, trip_id: str, extra_name: str = None):
        timestamp = datetime.now()

        stmt = insert(Reservation).values(
            user_id=user_id, 
            trip_id=trip_id,
            extra_passenger_name=extra_name,
            reservation_timestamp=timestamp
        ).returning(Reservation)

        result = await self.session.execute(stmt)

        return result.scalar_one()
    
    async def get_all_users_id_by_trip_id(self, trip_id: str):
        stmt = (
            select(Reservation.user_id)
            .where(Reservation.trip_id == trip_id)
        )

        result = await self.session.execute(stmt)
        return result.scalars().all()
    
    async def cancel_reservation(self, user_id: str):
        stmt = (
            select(Reservation)
            .where(Reservation.user_id == user_id)
        )

        result = await self.session.execute(stmt)
        reservation = result.scalar_one_or_none()

        if reservation:
            reservation.status = BoardingStatus.CANCELLED
            await self.session.commit()
            return True 
        
        return False
    

    async def activate_reservation(self, reservation_id: str):
        timestamp = datetime.now()

        stmt = (
            select(Reservation)
            .where(Reservation.id == reservation_id)
        )

        result = await self.session.execute(stmt)
        reservation = result.scalar_one_or_none()

        if reservation:
            reservation.status = BoardingStatus.NOT_BOARDED
            reservation.reservation_timestamp = timestamp
            await self.session.commit()
            return True 
        
        return False
    
    async def delete(self, reservation_id: str):
        stmt = (
            select(Reservation)
            .where(Reservation.id == reservation_id)
        )

        result = await self.session.execute(stmt)
        reservation = result.scalar_one_or_none()

        if reservation:
            await self.session.delete(reservation)
            await self.session.commit()
            return True
    
        return False        

    async def get_by_trip_id(self, trip_ID: str):
        stmt = (
            select(Reservation)
            .where(Reservation.trip_id == trip_ID)
            .order_by(Reservation.reservation_timestamp)
        )

        results = await self.session.execute(stmt)
        return results.scalars().all()
 