import asyncio
from starlette.concurrency import run_in_threadpool
from app.models.models import User
from app.utils.utils import generate_qr_code_base64
from app.services.engine.priority_engine import PriorityEngine
import uuid
from app.utils.utils import generate_registration_code
import logging
from app.DTOs.checkin import ManualCheckinRequestDTO
from app.enums.enums import BoardingStatus
from app.repositories.reservation_repository import ReservationRepository
from app.core.exceptions import NotFoundException, UnauthorizedException, ForbiddenException
import hmac

logger = logging.getLogger(__name__)

class ReservationService:
    def __init__(self, repository: ReservationRepository, priority_engine: PriorityEngine):
        self.repository = repository
        self.priority_engine = priority_engine

    async def check_reservation(self, trip_id: uuid.UUID, reservation_id: uuid.UUID):
        valid_reservations = await self.priority_engine.get_valid_reservation(trip_id)
        is_valid = any(r.reservation_id == reservation_id for r in valid_reservations)
        return is_valid

    async def checkin(self, trip_id: uuid.UUID, checkIn_code: str):
        logger.info(f"Checkin requested | checkIn_code: {checkIn_code[:10]}...")

        parts = checkIn_code.split(".")
        if len(parts) != 2:
            raise UnauthorizedException("Código inválido")
        reservation_id_str, received_hmac = parts

        try:
            reservation_uuid = uuid.UUID(reservation_id_str)
        except ValueError:
            raise UnauthorizedException("Código inválido")

        reservation = await self.repository.get_by_id(reservation_uuid)
        if not reservation:
            raise NotFoundException("Reserva não encontrada")

        if reservation.boarding_confirmation == BoardingStatus.BOARDED:
            raise ForbiddenException("Usuário já embarcado")

        expected_code = generate_registration_code(
            reservation.reservation_id,
            reservation.trip_id,
            reservation.user.registration_id,
        )
        _, expected_hmac = expected_code.split(".")

        if not hmac.compare_digest(expected_hmac, received_hmac):
            raise UnauthorizedException("Código de verificação inválido")

        is_valid = self.check_reservation(trip_id, reservation_uuid)

        if not is_valid:
            raise UnauthorizedException("Passageiro não está na lista de embarque")

        await self.repository.update_boarding(reservation)

        logger.info(f"Checkin successful | Reservation ID: {reservation_id_str}")
        
        return {"message": "Checkin realizado com sucesso"}
            
    async def manual_checkin(self, data: ManualCheckinRequestDTO):
        logger.info(f"Manual Checkin requested | Reservation: {data.reservation_id}")

        reservation = await self.repository.get_by_id(uuid.UUID(data.reservation_id))

        if not reservation:
            raise NotFoundException("Reserva não encontrada")

        if reservation.boarding_confirmation == BoardingStatus.BOARDED:
            raise ForbiddenException("Usuário já embarcado")
        
        if not (
                data.reservation_id == str(reservation.reservation_id) and 
                data.trip_id        == str(reservation.trip_id)        and 
                data.user_id        == str(reservation.user.user_id)
            ):
            raise UnauthorizedException("Código de verificação inválido")
        
        is_valid = self.check_reservation(reservation.trip_id, reservation.reservation_id)

        if not is_valid:
            raise UnauthorizedException("Passageiro não está na lista de embarque")

        await self.repository.update_boarding(reservation)

        logger.info(f"Checkin successful | Reservation ID: {data.reservation_id}")

        return {"message": "Checkin manual realizado com sucesso"}

    @staticmethod
    def _sync_generate_qr(reservation_id: str, trip_id: str, registration_id: str) -> str:
        code = generate_registration_code(reservation_id, trip_id, registration_id)
        return generate_qr_code_base64(code)

    async def get_checkin_code(self, user: User, trip_id: str):
        logger.info(f"Checkin code lookup requested | User ID: {user.sub} | Trip ID: {trip_id}")

        reservations = await self.repository.get_by_trip_and_user_id(user.sub, trip_id)
        if not reservations:
            raise NotFoundException("Reserva não encontrada!")

        tasks = [
            run_in_threadpool(
                self._sync_generate_qr,
                res.reservation_id,
                trip_id,
                user.registration_id
            )
            for res in reservations
        ]

        qr_codes = await asyncio.gather(*tasks)

        result = [
            {
                "name": res.extra_passenger_name or user.full_name,
                "qr_code": qr
            }
            for res, qr in zip(reservations, qr_codes)
        ]

        logger.info(f"Checkin code(s) retrieved successfully | User ID: {user.sub} | Trip ID: {trip_id}")
        return result

    