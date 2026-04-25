from app.middleware import require_admin
from fastapi import Body
from app.DTOs.fleet.dtos import BusCreateBatchDTO
from app.DTOs.fleet.dtos import BusCreateDTO
from app.DTOs.fleet.dtos import BusUpdateBatchDTO
from app.DTOs.fleet.dtos import BusUpdateDTO
from app.DTOs.fleet.dtos import BusBatchDeleteDTO
from fastapi import Depends
from app.database.db import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.bus_repository import BusRepository
from fastapi import APIRouter

router = APIRouter(
    dependencies=[Depends(require_admin)]
)

@router.get("/health")
async def health_check():
    return {"message": "Fleet router is running"}

@router.get("/")
async def get_all(session: AsyncSession = Depends(get_session)):
    repo = BusRepository(session)
    buses = await repo.get_all()

    return {"message": "Get all fleets endpoint", "buses": buses}

@router.get("/{plate}")
async def get_by_id(plate: str, session: AsyncSession = Depends(get_session)):
    repo = BusRepository(session)

    bus = await repo.get_by_plate(plate)

    if not bus:
        return {"message": "Bus not found"}
    
    return {"message": f"Get fleet with plate: {plate} endpoint", "bus": bus}

@router.post("/")
async def create_bus(dados: BusCreateDTO, session: AsyncSession = Depends(get_session)):
    repo = BusRepository(session)

    bus = await repo.create(dados)

    return {"message": f"Create bus with plate: {bus.bus_plate} endpoint", "bus": bus}

@router.patch("/{plate}")
async def update_bus(plate: str, data: BusUpdateDTO, session: AsyncSession = Depends(get_session)):
    repo = BusRepository(session)
    
    bus = await repo.patch(plate, data)

    if not bus:
        return {"message": "Bus not found"}

    return {"message": f"Update bus with plate: {plate} endpoint", "bus": bus}

@router.post("/batch")
async def create_buses_batch(dados: BusCreateBatchDTO, session: AsyncSession = Depends(get_session)):
    repo = BusRepository(session)

    buses = await repo.create_batch(dados)

    return {"message": f"Create {buses} buses"}

@router.patch("/update/batch")
async def update_buses_batch(dados: BusUpdateBatchDTO = Body(...), session: AsyncSession = Depends(get_session)):
    repo = BusRepository(session)

    updated_buses = await repo.patch_batch(dados)

    return {"message": f"Updated buses: {updated_buses}"}

@router.delete("/{plate}")
async def delete_bus(plate: str, session: AsyncSession = Depends(get_session)):
    repo = BusRepository(session)

    bus = await repo.delete(plate)

    if not bus:
        return {"message": "Bus not found"}

    return {"message": f"deletes {bus.plate}"}

@router.delete("/delete/batch")
async def delete_buses_batch(dados: BusBatchDeleteDTO, session: AsyncSession = Depends(get_session)):
    repo = BusRepository(session)

    await repo.delete_batch(dados.bus_plates)

    return {"message": f"Deleted {len(dados.bus_plates)} buses"}
