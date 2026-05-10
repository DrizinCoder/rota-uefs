import uuid
from app.utils.utils import generate_registration_code
import logging
from app.repositories.reservation_repository import ReservationRepository
from app.core.exceptions import NotFoundException, UnauthorizedException
import hmac

logger = logging.getLogger(__name__)

class ReservationService:
    def __init__(self, repository: ReservationRepository):
        self.repository = repository

    async def checkin(self, checkIn_code: str):
        logger.info(f"Checkin requested | checkIn_code: {checkIn_code[:10]}...")

        reservation_id, received_hmac = checkIn_code.split(".")

        reservation = await self.repository.get_by_id_checkin(uuid.UUID(reservation_id))

        if not reservation:
            raise NotFoundException("Reserva não encontrada")

        expected_code = generate_registration_code(
            reservation.reservation_id,
            reservation.trip_id,
            reservation.user.registration_id,
        )

        _, expected_hmac = expected_code.split(".")

        if not hmac.compare_digest(expected_hmac, received_hmac):
            raise UnauthorizedException("Código de verificação inválido")

        await self.repository.update_boarding(reservation)

        logger.info(f"Checkin successful | Reservation ID: {reservation_id}")
        return {"message": "Checkin realizado com sucesso"}
            