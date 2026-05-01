from app.core.exceptions import NotFoundException
from app.repositories.bus_repository import BusRepository
from app.DTOs.fleet import BusCreateDTO, BusUpdateDTO, BusCreateBatchDTO, BusUpdateBatchDTO, BusBatchDeleteDTO
import logging

logger = logging.getLogger(__name__)


class BusService:
    def __init__(self, repository: BusRepository):
        self.repository = repository

    async def get_all(self):
        logger.info("Bus list requested")

        result = await self.repository.get_all()

        logger.info(f"Bus list retrieved successfully | Count: {len(result) if result else 0}")
        return result

    async def get_by_plate(self, plate: str):
        logger.info(f"Bus lookup requested | Plate: {plate}")

        bus = await self.repository.get_by_plate(plate)
        if not bus:
            raise NotFoundException("Bus not found")

        logger.info(f"Bus retrieved successfully | Plate: {plate}")
        return bus

    async def create(self, dados: BusCreateDTO):
        logger.info(f"Bus creation requested | Plate: {dados.bus_plate}")

        result = await self.repository.create(dados)

        logger.info(f"Bus created successfully | Plate: {dados.bus_plate}")
        return result

    async def update(self, plate: str, data: BusUpdateDTO):
        logger.info(f"Bus update requested | Plate: {plate}")

        bus = await self.repository.patch(plate, data)
        if not bus:
            raise NotFoundException("Bus not found")

        logger.info(f"Bus updated successfully | Plate: {plate}")
        return bus

    async def create_batch(self, dados: BusCreateBatchDTO):
        logger.info(f"Bus batch creation requested | Count: {len(dados.buses)}")

        result = await self.repository.create_batch(dados)

        logger.info(f"Bus batch created successfully | Count: {len(dados.buses)}")
        return result

    async def update_batch(self, dados: BusUpdateBatchDTO):
        logger.info(f"Bus batch update requested | Count: {len(dados.buses)}")

        result = await self.repository.patch_batch(dados)

        logger.info(f"Bus batch updated successfully | Count: {len(dados.buses)}")
        return result

    async def delete(self, plate: str):
        logger.info(f"Bus deletion requested | Plate: {plate}")

        bus = await self.repository.delete(plate)
        if not bus:
            raise NotFoundException("Bus not found")

        logger.info(f"Bus deleted successfully | Plate: {plate}")
        return bus

    async def delete_batch(self, dados: BusBatchDeleteDTO):
        logger.info(f"Bus batch deletion requested | Count: {len(dados.bus_plates)}")

        await self.repository.delete_batch(dados.bus_plates)

        logger.info(f"Bus batch deleted successfully | Count: {len(dados.bus_plates)}")
        return len(dados.bus_plates)