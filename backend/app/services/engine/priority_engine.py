import uuid

from fastapi import BackgroundTasks
from app.repositories.user_repository import UserRepository
from app.repositories.reservation_repository import ReservationRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.bus_repository import BusRepository
from app.core.exceptions import InternalServerException, NotFoundException
from app.enums.enums import BoardingStatus, UserProfile
from app.core.responses import ResponseHandler
from app.core.config import Settings
from .notifications import Notifications

class PriorityEngine:
    def __init__(self, user_repo: UserRepository, trip_repo: TripRepository, res_repo: ReservationRepository, bus_repo: BusRepository):
        self.user_repository = user_repo
        self.trip_repository = trip_repo
        self.reservation_repository = res_repo
        self.bus_repository = bus_repo

    def get_priority(self, profile: UserProfile, boarding_status: BoardingStatus, extra_name: str = None):
        if boarding_status == BoardingStatus.BOARDED:
            return -1

        if profile == UserProfile.STAFF:
            if extra_name and extra_name.strip():
                return 1  
            return 0      

        if profile == UserProfile.STUDENT:
            return 2

        return 99
    
    async def _get_ordered_reservations(self, trip_id: str):
        reservations = await self.reservation_repository.get_by_trip_id(trip_id)

        return sorted(
            reservations,
            key=lambda r: (self.get_priority(r.user.profile, r.boarding_confirmation, r.extra_passenger_name), r.reservation_timestamp)
        )
        
    async def get_all_users_with_reservation_by_trip_id(
        self, 
        trip_id: str, 
        background_tasks: BackgroundTasks
    ):
        trip = await self.trip_repository.get_by_id(uuid.UUID(trip_id))

        if not trip:
            raise NotFoundException("Viagem não encontrada")
        
        bus = await self.bus_repository.get_by_plate(trip.bus_license_plate)
        capacity = bus.capacity if bus else 0
        
        ordered_reservations = await self._get_ordered_reservations(trip_id)

        valid_reservations = []
        waitlist_reservations = []

        for index, res in enumerate(ordered_reservations):
            is_guest = bool(res.extra_passenger_name and res.extra_passenger_name.strip())
            passenger_name = res.extra_passenger_name if is_guest else res.user.full_name

           
            is_staff_not_registered = res.user.full_name == "Staff Não Registrado"
            is_onboarded = (res.boarding_confirmation == BoardingStatus.BOARDED) or (index < capacity and is_staff_not_registered)

            user_data = {
                "reservation_id": str(res.reservation_id),
                "user_id": str(res.user_id),
                "name": passenger_name,
                "profile": res.user.profile.value,
                "onboard": is_onboarded,
                "is_invited": is_guest,
                "timestamp": res.reservation_timestamp
            }

            if index < capacity:
                if is_staff_not_registered and res.boarding_confirmation != BoardingStatus.BOARDED:
                    background_tasks.add_task(self._bg_confirm_staff_boarding, res.reservation_id)
                        
                valid_reservations.append(user_data)
            else:
                waitlist_reservations.append(user_data)

        return ResponseHandler.ok(
            data={
                "trip_id": trip.trip_id,
                "boarding_point": trip.route.boarding_point,
                "drop_off_point": trip.route.drop_off_point,
                "route_name": trip.route.name,
                "valid_reservations": valid_reservations,
                "waitlist_reservations": waitlist_reservations,
                "stats": {
                    "capacity": capacity,
                    "total_onboarded": sum(1 for r in valid_reservations if r["onboard"]),
                    "total_reservations": len(ordered_reservations),
                    "waitlist_count": len(waitlist_reservations)
                }
            },
            message="Listagem de passageiros na viagem."
        )
        
    async def get_valid_reservation(self, trip_id: uuid.UUID):
        trip = await self.trip_repository.get_by_id(trip_id)

        if not trip:
            raise NotFoundException("Viagem não encontrada")
        
        bus = await self.bus_repository.get_by_plate(trip.bus_license_plate)

        capacity = bus.capacity if bus else 0
        
        ordered_reservations = await self._get_ordered_reservations(trip_id)

        return ordered_reservations[:capacity]

    async def remove_boarding_confirmation(self, reservation_id: str):
        reservation = await self.reservation_repository.get_by_id(reservation_id)

        if not reservation:
            raise NotFoundException("Reserva não encontrada")

        await self.reservation_repository.remove_boarding_confirmation(reservation_id)

        return ResponseHandler.ok(message="Confirmação de embarque removida com sucesso.")
    
    
    async def _trip_is_available(self, trip_id: str):
        data = await self.trip_repository.get_bus_capacity_and_total_reservations_by_trip_id(uuid.UUID(trip_id)) 
        return data and data.capacity > data.total_reservations
        
        
    async def _bg_confirm_staff_boarding(self, reservation_id: uuid.UUID):
        try:
            await self.reservation_repository.confirm_boarding(reservation_id)
        except Exception as e:      
            return InternalServerException(f"Erro ao confirmar embarque de servidor avulso em background: {e}")
        
    async def subscriber_staff_generic_to_trip(self, trip_id: str):
        trip = await self.trip_repository.get_by_id(uuid.UUID(trip_id))
        if not trip: raise NotFoundException("Viagem não encontrada")

        staff_generic_user = await self.user_repository.get_by_registration_id("STAFF_UNREGISTERED")

        if not staff_generic_user: raise NotFoundException("Usuário genérico de servidor(a) não encontrado")
        
        boarded_status = BoardingStatus.BOARDED if await self._trip_is_available(trip_id) else BoardingStatus.NOT_BOARDED
                    
        await self.reservation_repository.create(
            user_id=staff_generic_user.user_id, 
            trip_id=trip_id, 
            extra_name=None,
            boarding_status=boarded_status
        )

        return ResponseHandler.created(message="Servidor(a) genérico inscrito na viagem.")   
    
    async def delete_reservation_staff_generic(self, reservation_id: str):
        reservation = await self.reservation_repository.get_id(reservation_id)

        if not reservation:
            raise NotFoundException("Reserva não encontrada")

        await self.reservation_repository.delete(reservation_id)

        return ResponseHandler.ok(message="Reserva deletada com sucesso.")
      
    async def subscribe_user_to_trip(self, user_id: str, trip_id: str, background_tasks: BackgroundTasks, extra_name: str = None):
        trip = await self.trip_repository.get_by_id(uuid.UUID(trip_id))
        if not trip: raise NotFoundException("Viagem não encontrada")
        
        user = await self.user_repository.get_by_id(uuid.UUID(user_id))
        if not user: raise NotFoundException("Usuário não encontrado")

        extra_name = extra_name.strip() if extra_name else ""
        if user.profile != UserProfile.STAFF:
            extra_name=""

        existing_reservation = await self.reservation_repository.get_reservation_by_user_and_trip_extra_name(user_id, trip_id, extra_name)
        
        if existing_reservation:
            await self.reservation_repository.activate_reservation(existing_reservation.reservation_id)

            await self.notifications.activate_notifications(user, trip, existing_reservation, background_tasks)

            return ResponseHandler.ok(message="Reserva reativada.")
        
        new_res = await self.reservation_repository.create(
            user_id=user_id, 
            trip_id=trip_id, 
            extra_name=extra_name
        )

        ordered_reservations = await self._get_ordered_reservations(trip_id)
        position = next(
            (i + 1 for i, r in enumerate(ordered_reservations) if r.reservation_id == new_res.reservation_id),
            None
        )

        await self.notifications.subscribe_notifications(user, trip, new_res, background_tasks, position)
        
        return ResponseHandler.created(new_res, "Inscrição realizada com sucesso.")

    async def cancel_subscription(self, profile: UserProfile, reservation_id: str, background_tasks: BackgroundTasks):
        reservation = await self.reservation_repository.get_by_id(reservation_id)
        
        if not reservation:
            raise NotFoundException("Reserva não encontrada")
      
        await self.reservation_repository.cancel_reservation(reservation.reservation_id)

        user = reservation.user
        trip = reservation.trip
        
        await self.notifications.cancel_subscription_notifications(user, profile, trip, reservation, background_tasks)
        
        return ResponseHandler.ok(message="Reserva cancelada com sucesso.")

    async def alert_cancelled_trip(self, trip_id: str, background_tasks: BackgroundTasks):
        trip = await self.trip_repository.get_by_id(uuid.UUID(trip_id))

        if not trip: raise NotFoundException("Viagem não encontrada")

        users = await self.trip_repository.get_all_users_with_reservation_active_by_trip_id(trip_id)
        
        for user in users:
            if user.user_id != "STAFF_UNREGISTERED":
                await self.notifications.send_trip_cancelled(
                    user.email, user.full_name, trip.id, trip.date.strftime("%d/%m/%Y"),
                    background_tasks
                )

        return ResponseHandler.ok(message="Viagem cancelada e usuários notificados.")
    
    
    
    async def verify_quorum(self, trip_id: str, background_tasks: BackgroundTasks):
        trip = await self.trip_repository.get_by_id(uuid.UUID(trip_id))

        if not trip: raise NotFoundException("Viagem não encontrada")
        
        reservations = await self.reservation_repository.get_reservation_of_staff(trip_id)
        
        if not reservations:
            await self.notifications.send_quorum_not_reached_notification(trip, background_tasks)
            return False
        
        return True
            
        