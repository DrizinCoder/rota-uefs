from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.middleware.auth_middleware import TokenData, require_admin
from app.repositories.user_repository import UserRepository 

from app.core.responses import ResponseHandler

drive_router = APIRouter()

@drive_router.get("/")
async def get_all_drivers(
    session: AsyncSession = Depends(get_session),
    _: TokenData = Depends(require_admin)
):
    repo = UserRepository(session)

    drivers = await repo.list_all_drivers()

    return ResponseHandler.ok(drivers)