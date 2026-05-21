from app.services.reservation_service import ReservationService
from app.services.web_push_service import PushSubscriptionService
import uuid
import logging

logger = logging.getLogger(__name__)

class NotificationController:
    def __init__(
        self,
        push_subscription_service: PushSubscriptionService,
        reservation_service: ReservationService,
    ):
        self.push_subscription_service = push_subscription_service
        self.reservation_service = reservation_service

    async def send_trip_cancellation(self, trip_id: uuid.UUID):
        logger.info(f"Notifying trip cancellation | Trip ID: {trip_id}")

        user_ids = await self.reservation_service.get_all_users_id_by_trip_id(trip_id)
        for user_id in user_ids:
            await self.push_subscription_service.send_to_user(
                user_id=user_id,
                title="Viagem cancelada",
                body="Sua viagem foi cancelada. Acesse o app para mais detalhes."
            )

    async def send_trip_confirmation(self, trip_id: uuid.UUID):
        logger.info(f"Notifying trip confirmation | Trip ID: {trip_id}")

        user_ids = await self.reservation_service.get_all_users_id_by_trip_id(trip_id)
        for user_id in user_ids:
            await self.push_subscription_service.send_to_user(
                user_id=user_id,
                title="Viagem confirmada",
                body="Sua viagem foi confirmada. Fique atento ao horário de embarque."
            )

    async def send_reservation_confirmation(self, user_id: uuid.UUID):
        logger.info(f"Notifying reservation confirmation | User ID: {user_id}")

        await self.push_subscription_service.send_to_user(
            user_id=user_id,
            title="Reserva confirmada",
            body="Sua reserva foi realizada com sucesso. Verifique a Caixa de Entrada do email para mais informações."
        )
    
    async def send_checkin_confirmation(self, user_id: uuid.UUID):
        logger.info(f"Notifying checkin confirmation | User ID: {user_id}")

        await self.push_subscription_service.send_to_user(
            user_id=user_id,
            title="Check-in realizado",
            body="Sua checkin foi realizado com sucesso."
        )