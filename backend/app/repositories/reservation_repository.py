from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert 
from sqlalchemy.orm import joinedload, selectinload
from app.models.models import Reservation
from app.enums.enums import BoardingStatus
from sqlmodel import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import Reservation, User
from app.enums.enums import BoardingStatus
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)

class ReservationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, reservation_id: str):
        stmt = (
            select(Reservation)
            .where(Reservation.reservation_id == reservation_id)
            .options(joinedload(Reservation.user), joinedload(Reservation.trip))
        )

        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, user_id: str, trip_id: str, extra_name: str = None):
        timestamp = datetime.now()

        stmt = insert(Reservation).values(
            user_id=user_id, 
            trip_id=trip_id,
            extra_passenger_name=extra_name,
            reservation_timestamp=timestamp
        ).returning(Reservation)

        result = await self.session.execute(stmt)
        reservation = result.scalar_one()

        await self.session.commit() 
        
        return reservation
    
    async def get_all_users_id_by_trip_id(self, trip_id: str):
        stmt = (
            select(Reservation.user_id)
            .where(Reservation.trip_id == trip_id)
        )

        result = await self.session.execute(stmt)
        return result.scalars().all()
    

    async def get_reservation_by_user_and_trip_extra_name(self, user_id: str, trip_id: str, extra_name: str = None):
        stmt = (select(Reservation)
                .where(Reservation.user_id == user_id)
                .where(Reservation.trip_id == trip_id)
                .where(Reservation.extra_passenger_name == extra_name)
                ).options(selectinload(Reservation.user),selectinload(Reservation.trip))
        
        result = await self.session.execute(stmt)

        return result.scalar_one_or_none()      
    
    async def cancel_reservation(self, reservation_id: str): 
        stmt = (
            select(Reservation)
            .where(Reservation.reservation_id == reservation_id)
        )

        result = await self.session.execute(stmt)
        reservation = result.scalar_one_or_none()

        if reservation:
            reservation.boarding_confirmation = BoardingStatus.CANCELLED            
            await self.session.commit()
            return True 
        
        return False
        

    async def activate_reservation(self, reservation_id: str):
        timestamp = datetime.now()

        stmt = (
            select(Reservation)
            .where(Reservation.reservation_id == reservation_id)
        )

        result = await self.session.execute(stmt)
        reservation = result.scalar_one_or_none()

        if reservation:
            reservation.boarding_confirmation = BoardingStatus.NOT_BOARDED
            reservation.reservation_timestamp = timestamp
            
            await self.session.commit()
            return True 
        
        return False
        
    async def delete(self, reservation_id: str):
        stmt = (
            select(Reservation)
            .where(Reservation.reservation_id == reservation_id)
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
            .where(Reservation.boarding_confirmation != BoardingStatus.CANCELLED)
            .order_by(Reservation.reservation_timestamp)
            .options(joinedload(Reservation.user)) 
        )

        results = await self.session.execute(stmt)
        return results.scalars().all()
 
    async def get_by_id_checkin(self, reservation_id: uuid.UUID) -> Reservation | None:
        statement = (
            select(Reservation)
            .join(User, User.user_id == Reservation.user_id)
            .where(Reservation.reservation_id == reservation_id)
            .options(selectinload(Reservation.user))
        )
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def update_boarding(self, reservation: Reservation) -> None:
        reservation.boarding_confirmation = BoardingStatus.BOARDED
        reservation.boarding_timestamp = datetime.now()
        self.session.add(reservation)
        await self.session.commit()
