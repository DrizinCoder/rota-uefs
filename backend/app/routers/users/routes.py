import uuid
from fastapi import APIRouter, Depends

from app.routers.users.staff.route_staff import staff_router
from app.routers.users.drive.route_drive import drive_router
from app.routers.users.student.route_student import student_router
from app.DTOs.users import PasswordUpdate, PhoneUpdate
from app.middleware.auth_middleware import TokenData, get_current_user, require_profile
from app.core.responses import ResponseHandler
from app.routers.users.dependencies import get_user_service
from app.services.user_service import UserService

user_router = APIRouter()

user_router.include_router(staff_router, prefix="/staff")
user_router.include_router(drive_router, prefix="/driver")
user_router.include_router(student_router, prefix="/student")

@user_router.get("/{id}")
async def get_user(
    id: uuid.UUID, 
    service: UserService = Depends(get_user_service),
    _: TokenData = Depends(get_current_user)
):
    user = await service.get_user_by_id(id)
    return ResponseHandler.ok(data={"user": user})

@user_router.delete("/delete/account/me")
async def delete_account(
    service: UserService = Depends(get_user_service),
    current_user: TokenData = Depends(get_current_user)
):
    await service.delete_account(current_user.sub)
    return ResponseHandler.no_content()

@user_router.patch("/update/password/{id}")
async def update_password(
    id: uuid.UUID, 
    data: PasswordUpdate, 
    service: UserService = Depends(get_user_service),
    _: TokenData = Depends(require_profile("ADMIN", "STAFF", "STUDENT"))
):
    await service.update_password(id, data)
    return ResponseHandler.ok(message="Senha atualizada com sucesso!")

@user_router.patch("/update/phone/{id}")
async def update_phone(
    id: uuid.UUID, 
    data: PhoneUpdate, 
    service: UserService = Depends(get_user_service),
    _: TokenData = Depends(require_profile("DRIVER", "STUDENT"))
):
    await service.update_phone(id, data)
    return ResponseHandler.ok(message="Telefone atualizado!")