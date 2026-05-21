from app.controllers.notification_controller import NotificationController
from app.routers.checkin.routes import get_reservation_service
from app.routers.users.dependencies import get_push_subscription_service
from app.services.web_push_service import PushSubscriptionService
from app.services.reservation_service import ReservationService
from fastapi import Depends

def get_notification_controller(
    push_service: PushSubscriptionService = Depends(get_push_subscription_service),
    reservation_service: ReservationService = Depends(get_reservation_service),
) -> NotificationController:
    return NotificationController(push_service, reservation_service)    