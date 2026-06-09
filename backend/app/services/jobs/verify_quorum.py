from app.services.jobs.dependencies import get_notification_controller
import asyncio
from datetime import datetime
import logging

from fastapi import BackgroundTasks
from app.database.db import AsyncSessionLocal
from app.repositories.user_repository import UserRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.reservation_repository import ReservationRepository
from app.repositories.bus_repository import BusRepository
from app.services.engine.priority_engine import PriorityEngine

logger = logging.getLogger(__name__)

def verify_quorum_job(trip_id: str):
    logger.info(f" ⏳ [JOB STARTED")
    
    async def async_block():
        async with AsyncSessionLocal() as session:
            priority_engine = PriorityEngine(
                user_repo=UserRepository(session),
                trip_repo=TripRepository(session),
                res_repo=ReservationRepository(session),
                bus_repo=BusRepository(session),
            )

            notification_controller = get_notification_controller(session)

            background_tasks = BackgroundTasks()
            success = await priority_engine.verify_quorum(trip_id, background_tasks)

            if success:
                await notification_controller.send_trip_confirmation(trip_id)
            else:
                await notification_controller.send_trip_cancellation(trip_id)
            
    asyncio.run(async_block())
    logger.info(f"[JOB CONCLUDED] Alarme processado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
