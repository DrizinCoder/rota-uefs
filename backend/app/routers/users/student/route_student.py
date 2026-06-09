from app.services.user_service import UserService
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.repositories.user_repository import UserRepository 
from fastapi import APIRouter
from app.core.responses import ResponseHandler
from app.middleware.auth_middleware import require_student


student_router = APIRouter(
    #dependencies=[Depends(require_student)]
)

async def get_user_service(session: AsyncSession = Depends(get_session)) -> UserService:
    repo = UserRepository(session)
    return UserService(repo)

@student_router.get("/")
async def get_all_estudantes(service: UserService = Depends(get_user_service)):
    result = await service.list_students()
    return ResponseHandler.ok(result)

@student_router.get("/matricula/{registration_id}/")
async def get_estudante_by_registration_id(
    registration_id: str,
    service: UserService = Depends(get_user_service)
):
    result = await service.get_student_by_registration(registration_id)
    return ResponseHandler.ok(result)

