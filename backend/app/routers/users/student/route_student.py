from app.DTOs.trip import TripDetailFeedItem
import uuid
from app.DTOs.trip import TripFeedItem
from datetime import datetime
from app.routers.users.dependencies import get_trip_service
from app.services.trip_service import TripService
from app.middleware import get_current_user
from app.middleware import TokenData
from app.services.user_service import UserService
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.repositories.user_repository import UserRepository 
from fastapi import APIRouter
from app.core.responses import ResponseHandler
from app.middleware.auth_middleware import require_student
from datetime import date
from fastapi import Query

student_router = APIRouter(
    #dependencies=[Depends(require_student)]
)

async def get_user_service(session: AsyncSession = Depends(get_session)) -> UserService:
    repo = UserRepository(session)
    return UserService(repo)

@student_router.get("/")
async def get_all_estudantes(service: UserService = Depends(get_user_service)):
    result = await service.list_students()
    return ResponseHandler.ok(result)

@student_router.get("/matricula/{registration_id}/")
async def get_estudante_by_registration_id(
    registration_id: str,
    service: UserService = Depends(get_user_service)
):
    result = await service.get_student_by_registration(registration_id)
    return ResponseHandler.ok(result)

@student_router.get("/trips", response_model=list[TripFeedItem])
async def get_student_trips(
    current_user: TokenData = Depends(get_current_user),
    service: TripService = Depends(get_trip_service),
    date: date = Query(...),
):
    result = await service.get_trips_for_student_feed(date)
    return ResponseHandler.ok(result)

@student_router.get("/trips/{trip_id}", response_model=TripDetailFeedItem)
async def get_trip_detail(
    trip_id: uuid.UUID,
    current_user: TokenData = Depends(get_current_user),
    service: TripService = Depends(get_trip_service),
):
    result = await service.get_trip_detail_for_feed(trip_id)
    return ResponseHandler.ok(result)