import uuid
from fastapi import APIRouter, Depends
from app.routers.users.staff.route_staff import staff_router
from app.routers.users.drive.route_drive import drive_router
from app.routers.users.student.route_student import student_router
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import pwd_context
from app.DTOs.users import PasswordUpdate, PhoneUpdate
from app.core.exceptions import BadRequestException, NotFoundException, UnprocessableEntityException
from app.database.db import get_session
from app.middleware.auth_middleware import TokenData, get_current_user, require_profile
from app.repositories.user_repository import UserRepository
from app.core.responses import ResponseHandler

user_router = APIRouter()

user_router.include_router(staff_router, prefix="/staff")
user_router.include_router(drive_router, prefix="/driver")
user_router.include_router(student_router, prefix="/student")

@user_router.get("/{id}")
async def get_user(
    id: uuid.UUID, 
    session: AsyncSession = Depends(get_session),
    _: TokenData = Depends(get_current_user)
):
    repo = UserRepository(session)

    user = repo.get_by_id(id)

    if not user:
        raise NotFoundException("Usuário não encontrado!")

    return ResponseHandler.ok(data={"user": user})

# --- Rota utilizada para se deletar ---    
@user_router.delete("/delete/account/me")
async def delete_account(
    session: AsyncSession = Depends(get_session),
    current_user: TokenData = Depends(get_current_user)
):
    repo = UserRepository(session)

    deleted_user = await repo.anonymize(current_user.sub)

    if not deleted_user:
        raise NotFoundException("Usuário não encontrado!")

    return ResponseHandler.no_content()

# ----------- Funcionalidades de Alteração de Dados ------------
@user_router.patch("/update/password/{id}")
async def update_password(
    id: uuid.UUID, data: PasswordUpdate, 
    session: AsyncSession = Depends(get_session),
    _: TokenData = Depends(require_profile("ADMIN", "STAFF", "STUDENT"))
):
    repo = UserRepository(session)

    user = await repo.get_by_id(id)

    if not user:
        raise NotFoundException("Usuário não encontrado!")

    hashed_password = pwd_context.hash(data.password)

    if pwd_context.verify(data.password, user.password):
        raise UnprocessableEntityException("A senha fornecida é a mesma senha atual!")

    if data.password != data.confirm_password:
        raise BadRequestException("As senhas não coincidem!")

    data.password = hashed_password

    updated_user = await repo.patch(id, data)

    if not updated_user:
        raise NotFoundException("Erro ao atualizar senha!")

    return {"Message": "Password Updated", "User": updated_user}

@user_router.patch("/update/phone/{id}")
async def update_profile(
    id: uuid.UUID, 
    data: PhoneUpdate, 
    session: AsyncSession = Depends(get_session),
    _: TokenData = Depends(require_profile("DRIVER", "STUDENT"))
):
    repo = UserRepository(session)
    updated_user = await repo.patch(id, data)

    if not updated_user:
        raise NotFoundException("Motorista não encontrado!")

    return ResponseHandler.ok("Telefone atualizado!")