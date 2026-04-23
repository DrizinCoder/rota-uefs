from app.core.exceptions import UnprocessableEntityException
from app.repositories.user_repository import pwd_context
from http.client import NOT_FOUND
from http.client import UNAUTHORIZED
from app.enums.enums import UserProfile
from app.DTOs.users.dtos import PasswordUpdate
from app.DTOs.users.dtos import PhoneUpdate
import uuid
from app.DTOs.auth.dtos import RegisterServidorDTO
from app.DTOs.users.dtos import CreateSimpleUserDTO
from fastapi import HTTPException
from app.repositories.user_repository import UserRepository
from fastapi import Depends
from app.database.db import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter
from app.core.exceptions import NotFoundException, BadRequestException
from app.core.responses import ResponseHandler
from app.DTOs.users.dtos import UpdateProfileUserDTO, UpdateProfileServidorDTO
from app.DTOs.operational.dtos import CreateReservaDTO, DeleteReservaDTO

router = APIRouter()

# Perfil do servidor

@router.get("/servidores")
async def get_all_servidores(session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    users = await repo.list_all_staff()

    if not users:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    return {"Message": "Staff Found", "Users": users}

#  -------- Perfil do motorista ----------------

@router.get("/drivers")
async def get_all_drivers(session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    users = await repo.list_all_drivers()

    if not users:
        raise HTTPException(status_code=404, detail="Drivers not found")

    return {"Message": "Drivers Found", "Users": users}


@router.patch("/update/phone/{id}")
async def update_profile(id: uuid.UUID, dados: PhoneUpdate, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    updated_user = await repo.patch(id, dados)

    if not updated_user:
        raise HTTPException(status_code=404, detail="Driver not found")

    return {"Message": "Phone Updated", "User": updated_user}

# ----------- Perfil do estudante ------------

@router.get("/estudantes")
async def get_all_estudantes(session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    users = await repo.list_all_students()

    if not users:
        raise HTTPException(status_code=404, detail="Students not found")

    return {"Message": "Students Found", "Users": users} 

@router.get("/{id}")
async def get_user(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    user = repo.get_by_id(id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"Message": "User Found", "User": user}

@router.get("/matricula/{registration_id}/")
async def get_estudante_by_registration_id(registration_id: str, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    
    user = repo.get_by_registration_id(registration_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"Message": "Student Found", "User": user}

@router.patch("/update/password/{id}")
async def update_password(id: uuid.UUID, dados: PasswordUpdate, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    # Isso deveria ser em um service!
    user = await repo.get_by_id(id)
    
    if not user:
        raise NotFoundException("Usuário não encontrado!")

    hashed_password = pwd_context.hash(dados.password)

    if pwd_context.verify(dados.password, user.password):
        raise UnprocessableEntityException("A senha fornecida é a mesma senha atual!")

    if dados.password != dados.confirm_password:
        raise BadRequestException("As senhas não coincidem!")

    dados.password = hashed_password

    updated_user = await repo.patch(id, dados)

    if not updated_user:
        raise NotFoundException("Erro ao atualizar senha!")

    return {"Message": "Password Updated", "User": updated_user}

# Essa rota pode ser usada para deletar qualquer usuário
@router.delete("/delete/account/{id}")
async def delete_account(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    deleted_user = await repo.anonymize(id)

    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"Message": "User Deleted", "User": deleted_user} 

@router.post("/create/simple_user")
async def create_simple_user(dados: CreateSimpleUserDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    user = await repo.create_simple_user(dados)

    if not user:
        raise BadRequestException("Erro ao criar usuário")

    return ResponseHandler.created(user, "Usuário criado com sucesso")

# Funcionalidades [Estudante, Servidor, Motorista]

@router.post("/register/reserva")
def update_profile(dados: CreateReservaDTO):
    return {"message": "olá! bem-vindo a create reserva"}


@router.delete("/delete/reserva")
def update_profile(dados: DeleteReservaDTO):
    return {"message": "olá! bem-vindo a delete reserva"}