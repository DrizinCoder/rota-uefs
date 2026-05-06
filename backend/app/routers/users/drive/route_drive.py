import uuid
from app.core.exceptions import NotFoundException
from fastapi import APIRouter, Depends
from app.routers.admin.routes import get_admin_controller
from app.controllers.admin_controller import AdminController
from app.middleware.auth_middleware import TokenData, require_admin
from app.core.responses import ResponseHandler
from app.DTOs.driver import DriverPatchDTO
from app.services.driver_service import DriverService
from app.routers.users.dependencies import get_driver_service
from fastapi.encoders import jsonable_encoder
from app.services.trip_service import TripService
from app.routers.users.dependencies import get_trip_service
from app.DTOs.trip import DriverTripItem
from app.middleware.auth_middleware import require_driver

drive_router = APIRouter()

@drive_router.get("/")
async def get_all_drivers(
    controller: AdminController = Depends(get_admin_controller),
    _: TokenData = Depends(require_admin)
):
    result = await controller.list_drivers()
    serialized = jsonable_encoder(result)
    return ResponseHandler.ok(data=serialized)

@drive_router.get("/{id}")
async def get_driver(
    id: uuid.UUID,
    controller: AdminController = Depends(get_admin_controller),
    _: TokenData = Depends(require_admin)
):
    result = await controller.get_driver(id)

    if not result:
        raise NotFoundException("Motorista não encontrado!")
        
    return ResponseHandler.ok(data=result)

@drive_router.patch("/{id}")
async def update_driver(
    id: uuid.UUID,
    data: DriverPatchDTO,
    service: DriverService = Depends(get_driver_service),
    _: TokenData = Depends(require_admin)
):
    result = await service.update_driver(id, data)
    
    return ResponseHandler.ok(data=result)
    
@drive_router.get("/trips/me", response_model=list[DriverTripItem])
async def get_driver_trips(
    current_user: TokenData = Depends(require_driver),
    service: TripService = Depends(get_trip_service)
):
    result = await service.get_trips_for_driver(current_user.user_id)
    return ResponseHandler.ok(data=result)
    