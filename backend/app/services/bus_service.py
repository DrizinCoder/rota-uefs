from app.core.exceptions import NotFoundException
from app.repositories.bus_repository import BusRepository
from app.DTOs.fleet import BusCreateDTO, BusUpdateDTO, BusCreateBatchDTO, BusUpdateBatchDTO, BusBatchDeleteDTO
import logging

logger = logging.getLogger(__name__)


class BusService:
    def __init__(self, repository: BusRepository):
        self.repository = repository

    async def get_all(self):
        return await self.repository.get_all()

    async def get_by_plate(self, plate: str):
        bus = await self.repository.get_by_plate(plate)
        if not bus:
            raise NotFoundException("Bus not found")
        return bus

    async def create(self, dados: BusCreateDTO):
        return await self.repository.create(dados)

    async def update(self, plate: str, data: BusUpdateDTO):
        bus = await self.repository.patch(plate, data)
        if not bus:
            raise NotFoundException("Bus not found")
        return bus

    async def create_batch(self, dados: BusCreateBatchDTO):
        return await self.repository.create_batch(dados)

    async def update_batch(self, dados: BusUpdateBatchDTO):
        return await self.repository.patch_batch(dados)

    async def delete(self, plate: str):
        bus = await self.repository.delete(plate)
        if not bus:
            raise NotFoundException("Bus not found")
        return bus

    async def delete_batch(self, dados: BusBatchDeleteDTO):
        await self.repository.delete_batch(dados.bus_plates)
        return len(dados.bus_plates)