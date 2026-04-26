import uuid
from datetime import date
from app.core.exceptions import NotFoundException
from app.repositories.trip_repository import TripRepository
from app.DTOs.trip import CreateTripDTO, UpdateTripDTO

class TripService:
    def __init__(self, trip_repository: TripRepository):
        self.trip_repository = trip_repository

    async def create(self, data: CreateTripDTO):
        return await self.trip_repository.create(data)

    async def get_all(self):
        return await self.trip_repository.get_all()

    async def get_by_id(self, trip_id: uuid.UUID):
        trip = await self.trip_repository.get_by_id(trip_id)
        if not trip:
            raise NotFoundException("Viagem não encontrada")
        return trip

    async def get_by_date(self, trip_date: date):
        return await self.trip_repository.get_by_date(trip_date)

    async def patch(self, trip_id: uuid.UUID, data: UpdateTripDTO):
        trip = await self.trip_repository.patch(trip_id, data)
        if not trip:
            raise NotFoundException("Viagem não encontrada")
        return trip

    async def delete(self, trip_id: uuid.UUID):
        trip = await self.trip_repository.delete(trip_id)
        if not trip:
            raise NotFoundException("Viagem não encontrada")
        return trip