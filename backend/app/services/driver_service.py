import uuid

from app.core.exceptions import  BadRequestException, NotFoundException
from app.repositories.user_repository import UserRepository
from app.DTOs.driver import DriverPatchDTO
from app.enums.enums import UserProfile
import logging

logger = logging.getLogger(__name__)


class DriverService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def update_driver(self, driver_id: uuid.UUID, data: DriverPatchDTO):
      logger.info(f"Driver update requested | Driver ID: {driver_id}")

      user = await self.repository.get_by_id(driver_id)
      
      if not user:
          raise NotFoundException("Motorista não encontrado!")
      
      if user.profile != UserProfile.DRIVER:
          raise BadRequestException("O usuário informado não é um motorista.")

      result = await self.repository.update_driver(user, data)

      logger.info(f"Driver updated successfully | Driver ID: {driver_id}")
      return result
      