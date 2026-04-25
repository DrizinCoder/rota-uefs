from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.middleware.auth_middleware import TokenData, require_admin
from app.repositories.user_repository import UserRepository 
from fastapi import APIRouter

staff_router = APIRouter()

from app.core.responses import ResponseHandler

@staff_router.get("/")
async def get_all_servidores(
    session: AsyncSession = Depends(get_session),
    _: TokenData = Depends(require_admin)
):
    repo = UserRepository(session)

    users = await repo.list_all_staff() # Aqui tem que retornar só servidores que tem status false em Register_status
    
    return ResponseHandler.ok(users)
