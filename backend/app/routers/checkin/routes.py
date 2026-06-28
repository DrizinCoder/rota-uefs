from app.enums.enums import UserProfile
from app.repositories.bus_repository import BusRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.user_repository import UserRepository
from app.services.engine.priority_engine import PriorityEngine
from app.DTOs.checkin import CheckinRequestDTO, ManualCheckinRequestDTO
from app.repositories.reservation_repository import ReservationRepository
from app.database.db import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.responses import ResponseHandler
from app.services.reservation_service import ReservationService
from app.middleware import TokenData
from fastapi import Depends
from fastapi import APIRouter

from app.middleware import require_profile
from app.repositories.web_push_repository import PushSubscriptionRepository

checkin_router = APIRouter(
    dependencies=[Depends(require_profile(UserProfile.DRIVER))]
)

async def get_priority_engine(session: AsyncSession = Depends(get_session)) -> PriorityEngine:
    return PriorityEngine(
        user_repo=UserRepository(session),
        trip_repo=TripRepository(session),
        res_repo=ReservationRepository(session),
        bus_repo=BusRepository(session),
        pushup_repo=PushSubscriptionRepository(session)
    )

async def get_reservation_service(
    session: AsyncSession = Depends(get_session),
    priority_engine: PriorityEngine = Depends(get_priority_engine),
) -> ReservationService:
    repo = ReservationRepository(session)
    return ReservationService(repo, priority_engine)
    
@checkin_router.post("/")
async def checkin(
    body: CheckinRequestDTO,
    service: ReservationService = Depends(get_reservation_service),
):
    result = await service.checkin(body.trip_id, body.checkin_code)
    return ResponseHandler.ok(result)

@checkin_router.post("/manual")
async def manual_checkin(
    body: ManualCheckinRequestDTO,
    service: ReservationService = Depends(get_reservation_service),
):
    result = await service.manual_checkin(body)
    return ResponseHandler.ok(result)
