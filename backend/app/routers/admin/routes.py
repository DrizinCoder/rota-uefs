import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.DTOs.auth.dtos import AdminRegisterResponseDTO, RegisterAdminDTO, MotoristaRegisterResponseDTO, RegisterMotoristaDTO
from app.DTOs.users.dtos import CreateAdminDTO
from app.core.responses import ResponseHandler
from app.core.exceptions import ConflictException, NotFoundException
from app.database.db import get_session
from app.repositories.user_repository import UserRepository
from app.services.admin_service import AdminService
from app.controllers.admin_controller import AdminController

router = APIRouter()


async def get_admin_controller(session: AsyncSession = Depends(get_session)) -> AdminController:
    user_repo = UserRepository(session)
    admin_service = AdminService(user_repo)
    return AdminController(admin_service)


@router.post("/register/motorista")
async def register_motorista(dados: RegisterMotoristaDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    driver = await repo.get_by_registration_id(dados.registration_id)
    if driver:
        raise ConflictException("Motorista já cadastrado")

    driver_created, temp_password = await repo.create_driver(dados)

    response_data = MotoristaRegisterResponseDTO.model_validate(driver_created)

    response_dict = response_data.model_dump(mode='json')
    response_dict["temp_password"] = temp_password

    return ResponseHandler.created(data=response_dict)

# ============ Rotas do CRUD ============

@router.post("/")
async def register_administrador(dados: RegisterAdminDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    admin = await repo.get_by_registration_id(dados.registration_id)
    if admin:
        raise ConflictException("Administrador já cadastrado")

    admin_created, admin_generalization, temp_password = await repo.create_admin(dados)

    response_data = AdminRegisterResponseDTO.model_validate(admin_created)

    response_dict = response_data.model_dump(mode='json')
    response_dict["temp_password"] = temp_password
    response_dict["access_level"] = admin_generalization.access_level

    return ResponseHandler.created(data=response_dict)


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