from app.DTOs.checkin import CheckinRequestDTO
from app.repositories.reservation_repository import ReservationRepository
from app.database.db import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.responses import ResponseHandler
from app.services.reservation_service import ReservationService
from app.middleware import TokenData
from fastapi import Depends
from fastapi import APIRouter

from app.middleware import require_driver

checkin_router = APIRouter(
    dependencies=[Depends(require_driver)]
)

async def get_reservation_service(session: AsyncSession = Depends(get_session)) -> ReservationService:
    repo = ReservationRepository(session)
    return ReservationService(repo)

@checkin_router.post("/")
async def checkin(
    body: CheckinRequestDTO,
    service: ReservationService = Depends(get_reservation_service),
):
    result = await service.checkin(body.checkin_code)
    return ResponseHandler.ok(result)
