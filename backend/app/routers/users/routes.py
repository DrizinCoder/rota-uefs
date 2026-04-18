import uuid
from app.DTOs.users.dtos import CreateSimpleUserDTO
from fastapi import HTTPException
from app.repositories.user_repository import UserRepository
from fastapi import Depends
from app.database.db import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter

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

@router.patch("/update/{id}/servidor")
async def update_profile(id: uuid.UUID, dados: UpdateProfileServidorDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    updated_user = await repo.patch(id, dados)

    if not updated_user:
        raise HTTPException(status_code=404, detail="Staff not found")

    return {"Message": "Staff Updated", "User": updated_user}

@router.delete("/delete/account/servidor")
def delete_account():
    return {"message": "olá! bem-vindo ao delete perfil servidor"}

#  -------- Perfil do motorista ----------------

@router.patch("/update/motorista")
def update_profile(dados: UpdateProfileUserDTO):
    return {"message": "olá! bem-vindo a update perfil motorista"}

@router.delete("/delete/account/motorista")
def delete_account(id: str):
    return {"message": "olá! bem-vindo ao delete perfil servidor"}

# ----------- Perfil do estudante ------------

@router.get("/estudantes")
async def get_all_estudantes(session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    users = await repo.list_all()

    if not users:
        raise HTTPException(status_code=404, detail="Students not found")

    return {"Message": "Students Found", "Users": users} 

@router.get("id/{id}/usuário")
async def get_estudante(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    user = repo.get_by_id(id)

    if not user:
        raise HTTPException(status_code=404, detail="Student not found")

    return {"Message": "Student Found", "User": user}

@router.get("registration/{registration_id}/estudante")
async def get_estudante_by_registration_id(registration_id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    
    user = repo.get_by_registration_id(registration_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"Message": "Student Found", "User": user}

@router.patch("/update/{id}/estudante")
async def update_profile(id: uuid.UUID, dados: UpdateProfileUserDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    updated_user = await repo.patch(id, dados)
    
    if not updated_user:
        raise HTTPException(status_code=404, detail="Student not found")
        
    return {"Message": "Student Updated", "User": updated_user}

@router.delete("/delete/account/{id}/estudante")
async def delete_account(id: uuid.UUID, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    deleted_user = await repo.delete(id)

    if not deleted_user:
        raise HTTPException(status_code=404, detail="Student not found")

    return {"Message": "Student Deleted", "User": deleted_user} 

@router.post("/create/estudante")
async def create_estudante(dados: CreateSimpleUserDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    user = await repo.create_simple_user(dados)

    if not user:
        raise HTTPException(status_code=404, detail="Student not found")

    return {"Message": "Student Created", "User": user}

# Funcionalidades [Estudante, Servidor, Motorista]

@router.post("/register/reserva")
def update_profile(dados: CreateReservaDTO):
    return {"message": "olá! bem-vindo a create reserva"}


@router.delete("/delete/reserva")
def update_profile(dados: DeleteReservaDTO):
    return {"message": "olá! bem-vindo a delete reserva"}