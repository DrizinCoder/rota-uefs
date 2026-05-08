from fastapi import BackgroundTasks
from app.repositories.user_repository import UserRepository
from app.repositories.reservation_repository import ReservationRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.bus_repository import BusRepository
from app.core.exceptions import NotFoundException
from app.enums.enums import UserProfile
from app.core.responses import ResponseHandler
from app.services.email.use_cases import EmailUseCases
from app.models.models import Trip, User 

class PriorityEngine:
    def __init__(self, user_repo: UserRepository, trip_repo: TripRepository, res_repo: ReservationRepository, bus_repo: BusRepository):
        self.user_repository = user_repo
        self.trip_repository = trip_repo
        self.reservation_repository = res_repo
        self.bus_repository = bus_repo

    def get_priority(self, profile):
        priorities = {UserProfile.STAFF: 0, UserProfile.STUDENT: 1}
        return priorities.get(profile, 99)

    async def _get_ordered_reservations(self, trip_id: str):
        reservations = await self.reservation_repository.get_by_trip_id(trip_id)

        return sorted(
            reservations,
            key=lambda r: (self.get_priority(r.user.profile), r.reservation_timestamp)
        )
    
    async def subscribe_notifications(self, user: User, trip: Trip):
        if user.profile == UserProfile.STAFF:
            await EmailUseCases().send_subscription_confirmation_staff(user.email, user.full_name, trip.name)
        if user.profile == UserProfile.STUDENT:
            await EmailUseCases().send_subscription_confirmation_student(user.email, user.full_name, trip.name)
        
    async def get_all_users_with_reservation_by_trip_id(self, trip_id: str):
        trip = await self.trip_repository.get_by_id(trip_id)

        if not trip:
            raise NotFoundException("Viagem não encontrada")
        
        bus = await self.bus_repository.get_by_plate(trip.bus_license_plate)

        capacity = bus.capacity if bus else 0
        
        ordered_reservations = await self._get_ordered_reservations(trip_id)

        valid_reservations = []
        waitlist_reservations = []

        for index, res in enumerate(ordered_reservations):
            is_guest = res.extra_passenger_name is not None
            passenger_name = res.extra_passenger_name if is_guest else res.user.full_name

            user_data = {
                "user_id": str(res.user_id),
                "name": passenger_name,
                "is_invited": is_guest,
                "timestamp": res.reservation_timestamp
            }

            if index < capacity:
                valid_reservations.append(user_data)
            else:
                waitlist_reservations.append(user_data)

        return ResponseHandler.ok(
            data={
                "valid_reservations": valid_reservations,
                "waitlist_reservations": waitlist_reservations,
                "stats": {
                    "capacity": capacity,
                    "total_reservations": len(ordered_reservations),
                    "waitlist_count": len(waitlist_reservations)
                }
            },
            message="Listagem de passageiros."
        )

    async def subscribe_user_to_trip(self, user_id: str, trip_id: str, extra_name: str = None):
        trip = await self.trip_repository.get_by_id(trip_id)
        if not trip: raise NotFoundException("Viagem não encontrada")
        
        user = await self.user_repository.get_by_id(user_id)
        if not user: raise NotFoundException("Usuário não encontrado")

        existing_reservation = await self.reservation_repository.get_reservation_by_user_and_trip_extra_name(user_id, trip_id, extra_name)
        
        if existing_reservation:
            await self.reservation_repository.activate_reservation(existing_reservation.id)
            return ResponseHandler.ok(message="Reserva reativada.")
        
        new_res = await self.reservation_repository.create(
            user_id=user_id, 
            trip_id=trip_id, 
            extra_name=extra_name
        )

        await self.subscribe_notifications(user, trip)
        
        return ResponseHandler.created(new_res, "Inscrição realizada com sucesso.")

    async def cancel_subscription(self, user_id: str, trip_id: str, extra_name: str = None):
        user_res = await self.reservation_repository.get_reservation_by_user_and_trip_extra_name(user_id, trip_id, extra_name)
        
        if not user_res:
            raise NotFoundException("Reserva não encontrada")

        await self.reservation_repository.cancel_reservation(user_res.id)
        
        return ResponseHandler.ok(message="Reserva cancelada com sucesso.")

    async def alert_cancelled_trip(self, trip_id: str, background_tasks: BackgroundTasks):
        trip = await self.trip_repository.get_by_id(trip_id)

        if not trip: raise NotFoundException("Viagem não encontrada")

        users = await self.trip_repository.get_all_users_with_reservation_active_by_trip_id(trip_id)
        
        for user in users:
            background_tasks.add_task(
                EmailUseCases().send_trip_cancelled,
                user.email, user.full_name, trip.name, trip.date.strftime("%d/%m/%Y")
            )

        return ResponseHandler.ok(message="Viagem cancelada e usuários notificados.")