from app.core.responses import ResponseHandler
from app.services.bus_service import BusService
from app.middleware import require_admin
from fastapi import Body
from app.DTOs.fleet import BusCreateBatchDTO, BusCreateDTO, BusUpdateBatchDTO, BusUpdateDTO, BusBatchDeleteDTO
from fastapi import Depends
from app.database.db import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.bus_repository import BusRepository
from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder

router = APIRouter(
    dependencies=[Depends(require_admin)]
)

async def get_bus_service(session: AsyncSession = Depends(get_session)) -> BusService:
    repo = BusRepository(session)
    return BusService(repo)


@router.get("/")
async def get_all(service: BusService = Depends(get_bus_service)):
    result = await service.get_all()
    serialized = jsonable_encoder(result)
    return ResponseHandler.ok(serialized)

@router.get("/{plate}")
async def get_by_plate(plate: str, service: BusService = Depends(get_bus_service)):
    result = await service.get_by_plate(plate)
    return ResponseHandler.ok(result)

@router.post("/")
async def create_bus(dados: BusCreateDTO, service: BusService = Depends(get_bus_service)):
    result = await service.create(dados)
    serialized = jsonable_encoder(result)
    return ResponseHandler.created(serialized)

@router.post("/batch")
async def create_buses_batch(dados: BusCreateBatchDTO, service: BusService = Depends(get_bus_service)):
    result = await service.create_batch(dados)
    return ResponseHandler.created(result)

@router.patch("/{plate}")
async def update_bus(plate: str, data: BusUpdateDTO, service: BusService = Depends(get_bus_service)):
    result = await service.update(plate, data)
    return ResponseHandler.ok(result)

@router.patch("/update/batch")
async def update_buses_batch(dados: BusUpdateBatchDTO = Body(...), service: BusService = Depends(get_bus_service)):
    result = await service.update_batch(dados)
    return ResponseHandler.ok(result)

@router.delete("/{plate}")
async def delete_bus(plate: str, service: BusService = Depends(get_bus_service)):
    result = await service.delete(plate)
    serialized = jsonable_encoder(result)
    return ResponseHandler.ok(serialized)

@router.delete("/delete/batch")
async def delete_buses_batch(dados: BusBatchDeleteDTO, service: BusService = Depends(get_bus_service)):
    result = await service.delete_batch(dados)
    return ResponseHandler.ok(result)