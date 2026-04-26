from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.db import get_session
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService
from app.services.auth_service import AuthService
from app.services.email.use_cases import EmailUseCases
from app.controllers.user_controller import UserController

async def get_user_controller(session: AsyncSession = Depends(get_session)) -> UserController:
    repo = UserRepository(session)
    user_service = UserService(repo)
    auth_service = AuthService()
    email_use_cases = EmailUseCases()

    return UserController(user_service, auth_service, email_use_cases)