from app.services.trip_service import TripService
from app.routers.users.dependencies import get_trip_service
from app.DTOs.trip import UpdateTripDTO
import uuid
from app.DTOs.trip import CreateTripDTO
from app.core.responses import ResponseHandler
from fastapi import Depends
from fastapi import APIRouter
from app.middleware import require_admin

trip_router = APIRouter(
    dependencies=[Depends(require_admin)]
)

@trip_router.get("/")
async def get_all_trips(service: TripService = Depends(get_trip_service)):
    result = await service.get_all()
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

@trip_router.delete("/{trip_id}")
async def delete_trip(trip_id: uuid.UUID, service: TripService = Depends(get_trip_service)):
    result = await service.delete(trip_id)
    return ResponseHandler.ok(result)
