from app.routers.admin.routes import get_admin_controller
from app.controllers.admin_controller import AdminController
from fastapi import APIRouter, Depends
from app.middleware.auth_middleware import TokenData, require_admin
from fastapi import APIRouter

staff_router = APIRouter()

from app.core.responses import ResponseHandler

@staff_router.get("/")
async def get_all_servidores(
    controller: AdminController = Depends(get_admin_controller),
    _: TokenData = Depends(require_admin)
):
    result = await controller.list_staff_status_pending()
    return ResponseHandler.ok(result)