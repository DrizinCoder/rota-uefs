from app.enums.enums import UserProfile
from app.DTOs.trip import TripDetailFeedItem
from app.middleware import TokenData
from app.middleware import get_current_user
from app.DTOs.trip import TripFeedItem
from app.services.trip_service import TripService
from app.routers.users.dependencies import get_trip_controller, get_trip_service
from app.DTOs.trip import UpdateTripDTO
import uuid
from app.DTOs.trip import CreateTripDTO
from app.core.responses import ResponseHandler
from fastapi import Depends
from fastapi import APIRouter
from app.middleware import require_admin
from datetime import date
from fastapi import Query

from app.controllers.trip_controller import TripController

trip_router = APIRouter(
    #dependencies=[Depends(require_admin)]
)


@trip_router.get("/info/route/id/{trip_id}")
async def get_name_route_by_trip_id(trip_id: uuid.UUID, service: TripService = Depends(get_trip_service)):
    result = await service.get_name_route_by_trip_id(trip_id)
    return ResponseHandler.ok(result)

@trip_router.get("/")
async def get_all_trips(service: TripService = Depends(get_trip_service)):
    result = await service.get_all()
    return ResponseHandler.ok(result)

@trip_router.get("/reservations")
async def get_all_reservations(service: TripService = Depends(get_trip_service)):
    result = await service.get_all_reservations()
    return ResponseHandler.ok(result)

@trip_router.get("/feed", response_model=list[TripFeedItem])
async def get_trips_for_feed(
    current_user: TokenData = Depends(get_current_user),
    service: TripService = Depends(get_trip_service)
):  
    
    result = await service.get_trips_for_feed(current_user.driver_id)
    return ResponseHandler.ok(result)

@trip_router.get("/me/{user_id}")
async def get_all_trips_by_user_id(user_id: uuid.UUID, controller: TripController = Depends(get_trip_controller)):
    result = await controller.get_all_trips_by_user_id(user_id)
    return ResponseHandler.ok(result)

@trip_router.post("/cancel/{trip_id}")
async def cancel_trip(trip_id: uuid.UUID, controller: TripController = Depends(get_trip_controller)):
    result = await controller.cancel_trip(trip_id)
    return ResponseHandler.ok(result)

@trip_router.get("/{trip_id}")
async def get_trip(trip_id: uuid.UUID, service: TripService = Depends(get_trip_service)):
    result = await service.get_by_id(trip_id)
    return ResponseHandler.ok(result)

@trip_router.post("/")
async def create_trip(data: CreateTripDTO, service: TripService = Depends(get_trip_service)):
    result = await service.create(data)
    return ResponseHandler.created(result)

@trip_router.patch("/{trip_id}")
async def patch_trip(trip_id: uuid.UUID, data: UpdateTripDTO, service: TripService = Depends(get_trip_service)):
    result = await service.patch(trip_id, data)
    return ResponseHandler.ok(result)

@trip_router.get("/feed/{trip_id}", response_model=TripDetailFeedItem)
async def get_trip_detail(
    trip_id: uuid.UUID,
    current_user: TokenData = Depends(get_current_user),
    service: TripService = Depends(get_trip_service),
):
    result = await service.get_trip_detail_for_feed(trip_id)
    return ResponseHandler.ok(result)

@trip_router.delete("/{trip_id}")
async def delete_trip(trip_id: uuid.UUID, service: TripService = Depends(get_trip_service)):
    result = await service.delete(trip_id)
    return ResponseHandler.ok(result)
