from app.DTOs.auth.dtos import MotoristaRegisterResponseDTO
from app.core.responses import ResponseHandler
from app.core.exceptions import ConflictException
from fastapi import Depends
from app.database.db import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.DTOs.auth.dtos import RegisterMotoristaDTO
from app.DTOs.auth.dtos import RegisterUserDTO
from fastapi import APIRouter

router = APIRouter()

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

@router.post("/register/admin")
async def register_administrador(dados: RegisterUserDTO):
    return {"message": "olá! bem-vindo a registro de admin"}


@router.get("/")
def welcome():
    return {"message": "olá"}