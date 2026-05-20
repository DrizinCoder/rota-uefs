from app.core.exceptions import NotFoundException
from app.core.exceptions import ConflictException
from backend.app.repositories.web_push_repository import PushSubscriptionRepository
from backend.app.DTOs.web_push import CreateWebPushSubscriptionDTO
import uuid
import logging

logger = logging.getLogger(__name__)

class PushSubscriptionService:
    def __init__(self, push_subscription_repo: PushSubscriptionRepository):
        self.push_subscription_repo = push_subscription_repo

    async def subscribe(self, user_id: uuid.UUID, data: CreateWebPushSubscriptionDTO):
        logger.info(f"Push subscription creation requested | User ID: {user_id}")

        existing = await self.push_subscription_repo.find_by_endpoint(data.endpoint)
        if existing:
            logger.warning(f"Push subscription already exists | User ID: {user_id}")
            raise ConflictException("Subscription already exists for this device")

        subscription = await self.push_subscription_repo.create(user_id, data)

        logger.info(f"Push subscription created successfully | User ID: {user_id}")
        return subscription
    
    async def unsubscribe(self, user_id: uuid.UUID, data: CreateWebPushSubscriptionDTO):
        logger.info(f"Push subscription deletion requested | User ID: {user_id}")

        existing = await self.push_subscription_repo.find_by_endpoint(data.endpoint)
        if not existing:
            logger.warning(f"Push subscription not found | User ID: {user_id}")
            raise NotFoundException("Subscription not found for this device")

        delete_success = await self.push_subscription_repo.delete(existing)

        logger.info(f"Push subscription deleted successfully | User ID: {user_id}")
        return delete_success