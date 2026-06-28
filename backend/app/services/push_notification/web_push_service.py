from app.models.models import PushSubscription
import asyncio
from app.core.exceptions import NotFoundException
from app.core.exceptions import ConflictException
from app.repositories.web_push_repository import PushSubscriptionRepository
from app.DTOs.web_push import CreateWebPushSubscriptionDTO
import uuid
import logging
from pywebpush import webpush, WebPushException
from app.core.config import settings
import json
from functools import partial

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
            print(f"Push subscription not found for user {user_id} and endpoint {data.endpoint}")
            logger.warning(f"Push subscription not found | User ID: {user_id}")
            raise NotFoundException("Subscription not found for this device")

        delete_success = await self.push_subscription_repo.delete(existing)

        logger.info(f"Push subscription deleted successfully | User ID: {user_id}")
        return delete_success

    async def _send_to_subscription(self, sub: PushSubscription, title: str, body: str):
        try:
            await asyncio.to_thread(
            partial(
                webpush,
                    subscription_info={
                        "endpoint": sub.endpoint,
                        "keys": {
                            "p256dh": sub.p256dh,
                            "auth": sub.auth
                        },
                    },
                    data=json.dumps({"title": title, "body": body}),
                    vapid_private_key=settings.VAPID_PRIVATE_KEY,
                    vapid_claims={"sub": "mailto:admin@rota-uefs.com"},
                )
            )
            logger.info(f"Push sent successfully | Endpoint: {sub.endpoint}")
        except WebPushException as e:
            if e.response and e.response.status_code == 410:
                logger.warning(f"Subscription expired (410), removing | Endpoint: {sub.endpoint}")
                await self.push_subscription_repo.delete(sub)
            else:
                logger.error(f"Failed to send push | Endpoint: {sub.endpoint} | Error: {e}")

    async def send_to_user(self, user_id: uuid.UUID, title: str, body: str):
        logger.info(f"Sending push notification | User ID: {user_id}")
        subscriptions = await self.push_subscription_repo.find_all_by_user_id(user_id)

        if not subscriptions:
            logger.warning(f"No subscriptions found | User ID: {user_id}")
            return

        await asyncio.gather(*[
            self._send_to_subscription(sub, title, body)
            for sub in subscriptions
        ])