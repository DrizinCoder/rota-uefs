from app.enums.enums import UserProfile
from app.DTOs.trip import ChangeTripStatusDTO
import uuid
from app.core.exceptions import NotFoundException
from fastapi import APIRouter, Depends
from app.routers.admin.routes import get_admin_controller
from app.controllers.admin_controller import AdminController
from app.middleware.auth_middleware import TokenData, require_profile
from app.core.responses import ResponseHandler
from app.DTOs.driver import DriverPatchDTO
from app.services.driver_service import DriverService
from app.routers.users.dependencies import get_driver_service
from fastapi.encoders import jsonable_encoder
from app.services.trip_service import TripService
from app.routers.users.dependencies import get_trip_service, get_trip_controller
from app.DTOs.trip import DriverTripItem, SubscribeData
from app.middleware.auth_middleware import require_profile
from app.controllers.trip_controller import TripController

drive_router = APIRouter()

@drive_router.get("/")
async def get_all_drivers(
    controller: AdminController = Depends(get_admin_controller),
    _: TokenData = Depends(require_profile(UserProfile.ADMIN))
):
    result = await controller.list_drivers()
    serialized = jsonable_encoder(result)
    return ResponseHandler.ok(data=serialized)

@drive_router.get("/{id}")
async def get_driver(
    id: uuid.UUID,
    controller: AdminController = Depends(get_admin_controller),
    _: TokenData = Depends(require_profile(UserProfile.ADMIN))
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
    _: TokenData = Depends(require_profile(UserProfile.ADMIN))
):
    result = await service.update_driver(id, data)
    
    return ResponseHandler.ok(data=result)
    
@drive_router.get("/trips/me", response_model=list[DriverTripItem])
async def get_driver_trips(
    current_user: TokenData = Depends(require_profile(UserProfile.DRIVER)),
    service: TripService = Depends(get_trip_service)
):
    result = await service.get_trips_for_driver(current_user.user_id)
    return ResponseHandler.ok(data=result)
    
@drive_router.post("/trips/{trip_id}/subscribe-staff-generic")
async def subscribe_staff_generic_to_trip(
    trip_id: str,
    controller: TripController = Depends(get_trip_controller),
    _: TokenData = Depends(require_profile(UserProfile.DRIVER))
):
    return await controller.subscriber_staff_generic(trip_id)

@drive_router.patch("/reservation/{reservation_id}/remove/boarding")
async def remove_boarding_confirmation(
    reservation_id: str,
    controller: TripController = Depends(get_trip_controller),
    _: TokenData = Depends(require_profile(UserProfile.DRIVER))
):
    return await controller.remove_boarding_confirmation(reservation_id)

@drive_router.delete("/reservations/{reservation_id}/delete-staff-generic")
async def delete_reservation_staff_generic(
    reservation_id: str,
    controller: TripController = Depends(get_trip_controller),
    _: TokenData = Depends(require_profile(UserProfile.DRIVER))
):
   return await controller.delete_reservation_staff_generic(reservation_id)
   
@drive_router.patch("/trip/{trip_id}/change-status")
async def change_trip_status(
    trip_id: uuid.UUID,
    data: ChangeTripStatusDTO,
    service: TripService = Depends(get_trip_service),
    _: TokenData = Depends(require_profile(UserProfile.DRIVER))
):
    return await service.change_trip_status(trip_id, data.status)