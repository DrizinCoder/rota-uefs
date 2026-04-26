from app.core.exceptions import NotFoundException
import uuid
from fastapi import APIRouter, Depends
from app.routers.admin.routes import get_admin_controller
from app.controllers.admin_controller import AdminController
from app.middleware.auth_middleware import TokenData, require_admin
from app.core.responses import ResponseHandler

drive_router = APIRouter()

@drive_router.get("/")
async def get_all_drivers(
    controller: AdminController = Depends(get_admin_controller),
    _: TokenData = Depends(require_admin)
):
    result = await controller.list_drivers()
    return ResponseHandler.ok(result)

@drive_router.get("/{id}")
async def get_driver(
    id: uuid.UUID,
    controller: AdminController = Depends(get_admin_controller),
    _: TokenData = Depends(require_admin)
):
    result = await controller.get_driver(id)

    if not result:
        raise NotFoundException("Motorista não encontrado!")
        
    return ResponseHandler.ok(result)