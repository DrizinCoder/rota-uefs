from app.core.exceptions import BadRequestException
from app.enums.enums import TripStatus
from app.DTOs.trip import PassengerTripItem
from app.DTOs.trip import TripFeedResponse
from app.DTOs.trip import TripDetailFeedItem
from app.DTOs.trip import TripFeedItem
from app.DTOs.trip import DriverTripItem
from app.DTOs.reports import TripInsuranceReportDTO
from calendar import calendar, monthrange
from datetime import datetime, timedelta, date
from app.enums.enums import TripRecurrence
import uuid
from app.core.exceptions import NotFoundException
from app.repositories.trip_repository import TripRepository
from app.DTOs.trip import CreateTripDTO, UpdateTripDTO
from app.core.scheduler import task_scheduler
from app.services.jobs.verify_quorum import verify_quorum_job
import logging
from app.DTOs.trip import WEEKDAY_PT


logger = logging.getLogger(__name__)
    
ALLOWED_TRANSITIONS = {
    TripStatus.PENDING: TripStatus.CONFIRMED,
    TripStatus.CONFIRMED: TripStatus.COMPLETED,
}

class TripService:
    def __init__(self, trip_repository: TripRepository):
        self.trip_repository = trip_repository


    async def get_all_trips_by_user_id(self, user_id: uuid.UUID):
        logger.info(f"Trips by user ID requested | User ID: {user_id}")

        trips = await self.trip_repository.get_all_trips_and_reservations_by_user_id(user_id)

        logger.info(f"Trips by user ID retrieved | User ID: {user_id} | Count: {len(trips)}")
        return trips


    async def get_all_reservations(self):
        logger.info("All reservations requested")

        reservations = await self.trip_repository.get_all_reservations()

        logger.info(f"All reservations retrieved | Count: {len(reservations)}")
        return reservations

    async def create(self, data: CreateTripDTO):
        logger.info(f"Trip creation requested | Date: {data.trip_date} | Recurrence: {data.recurrence}")

        dates = self._generate_dates(data.trip_date, data.recurrence)
        
        trips = []
        for trip_date in dates:
            trip_data = data.model_copy(update={"trip_date": trip_date})
            trip = await self.trip_repository.create(trip_data)
            trips.append(trip)
        
        for trip in trips:
            departure_datetime = datetime.combine(trip.trip_date, trip.departure_time)
            
            task_scheduler.schedule_task(
                verify_quorum_job,
                departure_datetime,
                str(trip.trip_id),
                #minutes_notice=60,  # Verificar o quorum 1 hora antes da viagem
                #misfire_grace_time=3600  # Permitir que a tarefa seja executada mesmo que haja um atraso de até 1 hora
            )
            
        logger.info(f"Trips created successfully | Count: {len(trips)}")
        return [trip.model_dump(mode='json') for trip in trips]

    async def cancel_trip(self, trip_id: str):
        logger.info(f"Trip cancellation requested | Trip: {trip_id}")

        trip = await self.trip_repository.cancel_trip(trip_id)

        if not trip:
            raise NotFoundException("Viagem não encontrada")

        logger.info(f"Trip cancelled successfully | Trip ID: {trip_id}")
        
        return 
    
    async def get_all(self):
        logger.info("Trip list requested")

        result = await self.trip_repository.get_all_with_reservation()

        logger.info(f"Trip list retrieved successfully | Count: {len(result) if result else 0}")
        return result

    async def get_by_id(self, trip_id: uuid.UUID):
        logger.info(f"Trip lookup requested | Trip ID: {trip_id}")

        trip = await self.trip_repository.get_by_id(trip_id)
        if not trip:
            raise NotFoundException("Viagem não encontrada")

        logger.info(f"Trip retrieved successfully | Trip ID: {trip_id}")
        return trip.model_dump(mode='json')

    async def get_by_date(self, trip_date: date):
        logger.info(f"Trips by date requested | Date: {trip_date}")

        trips = await self.trip_repository.get_by_date(trip_date)

        logger.info(f"Trips by date retrieved successfully | Date: {trip_date} | Count: {len(trips)}")
        return [trip.model_dump(mode='json') for trip in trips]

    async def patch(self, trip_id: uuid.UUID, data: UpdateTripDTO):
        logger.info(f"Trip update requested | Trip ID: {trip_id}")

        trip = await self.trip_repository.patch(trip_id, data)
        if not trip:
            raise NotFoundException("Viagem não encontrada")

        logger.info(f"Trip updated successfully | Trip ID: {trip_id}")
        return trip.model_dump(mode='json')

    async def delete(self, trip_id: uuid.UUID):
        logger.info(f"Trip deletion requested | Trip ID: {trip_id}")

        trip = await self.trip_repository.delete(trip_id)
        if not trip:
            raise NotFoundException("Viagem não encontrada")

        logger.info(f"Trip deleted successfully | Trip ID: {trip_id}")
        return trip.model_dump(mode='json')
    
    async def get_trips_for_feed(self, driver_id: uuid.UUID | None = None) -> TripFeedResponse:
        today = date.today()
        weekday = today.weekday()
        if weekday < 5:  # Segunda a Sexta
            start_date = today
            days_until_friday = 4 - weekday
            end_date = today + timedelta(days=days_until_friday)
        else:  # Sábado (5) ou Domingo (6)
            days_until_next_monday = 7 - weekday
            start_date = today + timedelta(days=days_until_next_monday)
            end_date = start_date + timedelta(days=4)

        logger.info(
            f"Trips for feed requested | driver_filter: {driver_id} | ..."
        )
        trips = await self.trip_repository.get_trips_for_feed_by_date_range(
            start_date, end_date, driver_id
        )

        logger.info(f"Trips for feed retrieved | Count: {len(trips)}")

        reference_weekday = WEEKDAY_PT[weekday] if weekday < 5 else WEEKDAY_PT[0]

        return TripFeedResponse(
            reference_date=today,
            reference_weekday=reference_weekday,
            start_date=start_date,
            end_date=end_date, 
            trips=trips
        )

    def _generate_dates(self, start_date: date, recurrence: TripRecurrence) -> list[date]:
        if recurrence == TripRecurrence.SINGLE:
            return [start_date]

        if recurrence == TripRecurrence.WEEKLY:
            # da data até sexta da mesma semana
            dates = []
            current = start_date
            while current.weekday() < 5:  # 0=seg, 4=sex, 5=sab
                dates.append(current)
                current += timedelta(days=1)
            return dates

        if recurrence == TripRecurrence.MONTHLY:
            # da data até o último dia útil do mês
            dates = []
            _, last_day = monthrange(start_date.year, start_date.month)
            current = start_date
            while current.day <= last_day:
                if current.weekday() < 5:  # ignora sab e dom
                    dates.append(current)
                if current.day == last_day:
                    break
                current += timedelta(days=1)
            return dates

    async def get_trip_detail_for_feed(self, trip_id: uuid.UUID) -> TripDetailFeedItem:
        logger.info(f"Trip detail for feed requested | Trip ID: {trip_id}")

        trip = await self.trip_repository.get_trip_detail_for_feed(trip_id)
        if not trip:
            raise NotFoundException("Viagem não encontrada")

        logger.info(f"Trip detail retrieved successfully | Trip ID: {trip_id}")
        return trip
    
    async def get_trips_for_passenger(self, user_id: uuid.UUID) -> list[PassengerTripItem]:
        logger.info(f"Passenger trips requested | User ID: {user_id}")

        trips = await self.trip_repository.get_trips_by_user_id(user_id)

        logger.info(f"Passenger trips retrieved | User ID: {user_id} | Count: {len(trips)}")
        return trips
    
    async def get_trips_for_driver(self, driver_id: uuid.UUID) -> list[DriverTripItem]:
        logger.info(f"Driver trips requested | Driver ID: {driver_id}")

        trips = await self.trip_repository.get_trips_by_driver_id(driver_id)

        logger.info(f"Driver trips retrieved | Driver ID: {driver_id} | Count: {len(trips)}")
        return trips


async def change_trip_status(self, trip_id: uuid.UUID, new_status: TripStatus):
    trip = await self.trip_repository.get_by_id(trip_id)
    if not trip:
        raise NotFoundException("Viagem não encontrada")

    allowed_next = ALLOWED_TRANSITIONS.get(trip.status)
    if allowed_next != new_status:
        raise BadRequestException(f"Transição inválida: '{trip.status}' → '{new_status}'")

    return await self.trip_repository.update_status(trip, new_status)
    