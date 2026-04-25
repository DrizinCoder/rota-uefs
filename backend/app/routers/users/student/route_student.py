from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.middleware.auth_middleware import TokenData, require_admin
from app.repositories.user_repository import UserRepository 
from fastapi import APIRouter
from app.core.exceptions import NotFoundException
from app.core.responses import ResponseHandler

student_router = APIRouter()

@student_router.get("/")
async def get_all_estudantes(
    session: AsyncSession = Depends(get_session)  
):
    repo = UserRepository(session)

    users = await repo.list_all_students()

    return ResponseHandler.ok(users)

@student_router.get("/matricula/{registration_id}/")
async def get_estudante_by_registration_id(
    registration_id: str, session: AsyncSession = Depends(get_session)
):
    repo = UserRepository(session)
    
    user = repo.get_by_registration_id(registration_id)

    if not user:
        raise NotFoundException("Estudante não encontrado!")
    
  
    return ResponseHandler.ok(user)
