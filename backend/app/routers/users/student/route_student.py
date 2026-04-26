from app.services.user_service import UserService
from app.controllers.user_controller import UserController
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.middleware.auth_middleware import TokenData, require_admin
from app.repositories.user_repository import UserRepository 
from fastapi import APIRouter
from app.core.exceptions import NotFoundException
from app.core.responses import ResponseHandler

student_router = APIRouter()

async def get_user_controller(session: AsyncSession = Depends(get_session)) -> UserController:
    user_repo = UserRepository(session)
    user_service = UserService(user_repo)
    return UserController(user_service) 

@student_router.get("/")
async def get_all_estudantes(
    controller: UserController = Depends(get_user_controller)
):
    result = await controller.list_students()
    return ResponseHandler.ok(result)

@student_router.get("/matricula/{registration_id}/")
async def get_estudante_by_registration_id(
    registration_id: str,
    controller: UserController = Depends(get_user_controller)
):
    result = await controller.get_student_by_registration(registration_id)
    return ResponseHandler.ok(result)