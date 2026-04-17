from fastapi import HTTPException
from dataclasses import asdict
from app.repositories.user_repository import UserRepository
from fastapi import Depends
from app.database.db import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter

from app.DTOs.users.dtos import UpdateProfileUserDTO, UpdateProfileServidorDTO, UpdateProfileMotoristaDTO
from app.DTOs.operational.dtos import CreateReservaDTO, DeleteReservaDTO

router = APIRouter()

# Perfil do servidor

@router.patch("/update/servidor")
def update_profile(dados: UpdateProfileServidorDTO):
    return {"message": "olá! bem-vindo a update perfil servidor"}

@router.delete("/delete/account/servidor")
def delete_account():
    return {"message": "olá! bem-vindo ao delete perfil servidor"}

# Perfil do motorista

@router.patch("/update/motorista")
def update_profile(dados: UpdateProfileMotoristaDTO):
    return {"message": "olá! bem-vindo a update perfil motorista"}

@router.delete("/delete/account/motorista")
def delete_account(id: str):
    return {"message": "olá! bem-vindo ao delete perfil servidor"}

# Perfil do estudante

@router.get("/estudantes")
async def get_all_estudantes(session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    return await repo.list_all() 

@router.get("id/{id}/estudante")
async def get_estudante(id: str, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    
    return await repo.get_by_id(id)

@router.get("registration/{registration_id}/estudante")
async def get_estudante_by_registration_id(registration_id: str, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)
    
    return await repo.get_by_registration_id(registration_id)

@router.patch("/update/{id}/estudante")
async def update_profile(id: str, dados: UpdateProfileUserDTO, session: AsyncSession = Depends(get_session)):
    repo = UserRepository(session)

    data_dict = asdict(dados)

    updated_user = await repo.patch(id, data_dict)
    
    if not updated_user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
    return updated_user

@router.delete("/delete/account/estudante")
async def delete_account(session: AsyncSession = Depends(get_session)):
    return {"message": "olá! bem-vindo ao delete perfil estudante"}

# Funcionalidades [Estudante, Servidor, Motorista]

@router.post("/register/reserva")
def update_profile(dados: CreateReservaDTO):
    return {"message": "olá! bem-vindo a create reserva"}


@router.delete("/delete/reserva")
def update_profile(dados: DeleteReservaDTO):
    return {"message": "olá! bem-vindo a delete reserva"}