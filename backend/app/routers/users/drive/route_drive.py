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
    