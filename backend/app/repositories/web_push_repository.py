from app.core.exceptions import ConflictException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from app.DTOs.web_push import CreateWebPushSubscriptionDTO
from app.models import PushSubscription
import logging

logger = logging.getLogger(__name__)

class PushSubscriptionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def find_by_endpoint(self, endpoint: str):
        result = await self.session.execute(select(PushSubscription).where(PushSubscription.endpoint == endpoint))
        return result.scalar_one_or_none()

    async def create(self, user_id: uuid.UUID, data: CreateWebPushSubscriptionDTO):
        push_subscription = PushSubscription(
            user_id=user_id,
            endpoint=data.endpoint,
            p256dh=data.p256dh,
            auth=data.auth
        )
        self.session.add(push_subscription)
        await self.session.commit()
        await self.session.refresh(push_subscription)
        return push_subscription