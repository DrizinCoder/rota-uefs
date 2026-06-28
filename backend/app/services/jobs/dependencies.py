from app.services.reservation_service import ReservationService
from app.repositories.web_push_repository import PushSubscriptionRepository
from app.services.push_notification.web_push_service import PushSubscriptionService
from app.controllers.notification_controller import NotificationController
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.db import get_session
from app.repositories.user_repository import UserRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.reservation_repository import ReservationRepository
from app.repositories.bus_repository import BusRepository
from app.services.engine.priority_engine import PriorityEngine

def get_priority_engine(session: AsyncSession = Depends(get_session)) -> PriorityEngine:
    return PriorityEngine(
        user_repo=UserRepository(session),
        trip_repo=TripRepository(session),
        res_repo=ReservationRepository(session),
        bus_repo=BusRepository(session),
        pushup_repo=PushSubscriptionRepository(session)
    )


def get_notification_controller(session: AsyncSession = Depends(get_session)) -> NotificationController:
    return NotificationController(
        push_subscription_service=PushSubscriptionService(PushSubscriptionRepository(session)),
        reservation_service=ReservationService(ReservationRepository(session)),
    )