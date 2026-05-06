from app.services.engine.priority_engine import PriorityEngine
from app.services.trip_service import TripService
import logging

logger = logging.getLogger(__name__)

class TripController:
    def __init__(self, trip_service: TripService, priority_engine: PriorityEngine):
        self.trip_service = trip_service
        self.priority_engine = priority_engine

    async def subscriber(self, user_id: str, trip_id: str):
        try:
            return await self.priority_engine.subscribe_user_to_trip(user_id, trip_id)
        except Exception as e:
            logger.error(f"Error fetching subscriber for trip {trip_id}: {e}")
            raise
        