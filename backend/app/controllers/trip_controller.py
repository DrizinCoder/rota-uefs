from datetime import datetime
import uuid
import base64
from app.services.reports.weasyprint_generator import WeasyPrintGenerator
from fastapi import BackgroundTasks
from app.services.engine.priority_engine import PriorityEngine
from app.services.trip_service import TripService
from app.enums.enums import UserProfile

import logging

logger = logging.getLogger(__name__)

class TripController:
    def __init__(self, trip_service: TripService, priority_engine: PriorityEngine):
        self.trip_service = trip_service
        self.priority_engine = priority_engine

    async def subscriber(self, user_id: str, trip_id: str, background_tasks: BackgroundTasks, extra_name: str = None,):
        try:
            return await self.priority_engine.subscribe_user_to_trip(user_id, trip_id, background_tasks, extra_name)
        except Exception as e:
            logger.error(f"Error fetching subscriber for trip {trip_id}: {e}")
            raise

    async def remove_boarding_confirmation(self, reservation_id: str):
        try:
            return await self.priority_engine.remove_boarding_confirmation(reservation_id)
        except Exception as e:
            logger.error(f"Error removing boarding confirmation for reservation {reservation_id}: {e}")
            raise

    async def get_all_trips_by_user_id(self, user_id: uuid.UUID):
        try:
            return await self.trip_service.get_all_trips_by_user_id(user_id)
        except Exception as e:
            logger.error(f"Error fetching generic all trip by user id {user_id}: {e}")
            raise 

    async def subscriber_staff_generic(self, trip_id: str):
        try:
            return await self.priority_engine.subscriber_staff_generic_to_trip(trip_id)
        except Exception as e:
            logger.error(f"Error subscribing generic staff to trip {trip_id}: {e}")
            raise

    async def delete_reservation_staff_generic(self, reservation_id: str):
        try:
            return await self.priority_engine.delete_reservation_staff_generic(reservation_id)
        except Exception as e:
            logger.error(f"Error deleting generic staff reservation {reservation_id}: {e}")
            raise

    async def get_subscribers(self, trip_id: str, background_tasks: BackgroundTasks):
        try:
            return await self.priority_engine.get_all_users_with_reservation_by_trip_id(trip_id, background_tasks)
        except Exception as e:
            logger.error(f"Error fetching subscribers for trip {trip_id}: {e}")
            raise

    async def cancel_subscription(self, profile: UserProfile, reservation_id: str, background_tasks: BackgroundTasks):
        try:
            return await self.priority_engine.cancel_subscription(profile, reservation_id, background_tasks)
        except Exception as e:
            logger.error(f"Error canceling subscription for reservation {reservation_id}: {e}")
            raise
