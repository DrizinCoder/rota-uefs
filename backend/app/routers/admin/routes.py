from app.middleware import require_admin
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.DTOs.auth.dtos import RegisterAdminDTO
from app.services.admin_service import AdminService
from app.repositories.user_repository import UserRepository
from app.controllers.admin_controller import AdminController
from app.database.db import get_session
from app.core.responses import ResponseHandler
from app.core.exceptions import NotFoundException

router = APIRouter(
    dependencies=[Depends(require_admin)]
)

async def get_admin_controller(session: AsyncSession = Depends(get_session)) -> AdminController:
    user_repo = UserRepository(session)
    admin_service = AdminService(user_repo)
    return AdminController(admin_service)


@router.get("/")
async def list_admins(
    controller: AdminController = Depends(get_admin_controller)
):
    result = await controller.list_all()
    
    if not result:
        return ResponseHandler.ok([], "Nenhum administrador encontrado")
    
    return ResponseHandler.ok(result, "Administradores encontrados")


@router.get("/{admin_id}")
async def get_admin(
    admin_id: uuid.UUID,
    controller: AdminController = Depends(get_admin_controller)
):
    result = await controller.get_by_id(admin_id)
    
    if not result:
        raise NotFoundException("Administrador não encontrado")
    
    return ResponseHandler.ok(result, "Administrador encontrado")


@router.patch("/{admin_id}")
async def update_admin(
    admin_id: uuid.UUID,
    update_data: dict,
    controller: AdminController = Depends(get_admin_controller)
):
    result = await controller.update(admin_id, update_data)
    
    if not result:
        raise NotFoundException("Administrador não encontrado")
    
    return ResponseHandler.ok(result, "Administrador atualizado com sucesso")


@router.delete("/{admin_id}")
async def delete_admin(
    admin_id: uuid.UUID,
    controller: AdminController = Depends(get_admin_controller)
):
    result = await controller.delete(admin_id)
    
    if not result:
        raise NotFoundException("Administrador não encontrado")
    
    return ResponseHandler.ok({"deleted": True}, "Administrador removido com sucesso")

