from app.repositories.reservation_repository import ReservationRepository
from app.repositories.bus_repository import BusRepository
from app.services.engine.priority_engine import PriorityEngine
from app.services.trip_service import TripService
from app.repositories.trip_repository import TripRepository
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService
from app.services.auth_service import AuthService
from app.services.email.use_cases import EmailUseCases
from app.controllers.user_controller import UserController
from app.controllers.trip_controller import TripController

from app.services.driver_service import DriverService 

# Driver Dependencies

async def get_driver_service(session: AsyncSession = Depends(get_session)) -> DriverService:
    repo = UserRepository(session)
    return DriverService(repo)


# User Dependencies

async def get_user_service(session: AsyncSession = Depends(get_session)) -> UserService:
    repo = UserRepository(session)
    return UserService(repo)

async def get_user_controller(
    user_service: UserService = Depends(get_user_service)
) -> UserController:
    auth_service = AuthService()
    email_use_cases = EmailUseCases()

    return UserController(user_service, auth_service, email_use_cases)


# Trip Dependencies

async def get_trip_service(session: AsyncSession = Depends(get_session)) -> TripService:
    repo = TripRepository(session)
    return TripService(repo)

async def get_priority_engine(
    session: AsyncSession = Depends(get_session)
) -> PriorityEngine:
    
    user_repo = UserRepository(session)
    trip_repo = TripRepository(session)
    res_repo = ReservationRepository(session)
    bus_repo = BusRepository(session)

    return PriorityEngine(
        user_repo=user_repo,
        trip_repo=trip_repo,
        res_repo=res_repo,
        bus_repo=bus_repo
    )

async def get_trip_controller(
    trip_service: TripService = Depends(get_trip_service),
    priority_engine: PriorityEngine = Depends(get_priority_engine)
) -> TripController:
    
    return TripController(trip_service, priority_engine)