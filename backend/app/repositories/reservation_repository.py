from sqlmodel import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Reservation, User
from app.enums.enums import BoardingStatus
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)

class ReservationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, reservation_id: uuid.UUID) -> Reservation | None:
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