from fastapi import BackgroundTasks, logger
from app.repositories.user_repository import UserRepository
from app.repositories.reservation_repository import ReservationRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.bus_repository import BusRepository
from app.core.exceptions import NotFoundException
from app.enums.enums import UserProfile
from app.core.responses import ResponseHandler
from app.services.email.use_cases import EmailUseCases
from app.models.models import Reservation, Trip, User 

class Notifications:
    def __init__(self, user_repo: UserRepository, trip_repo: TripRepository, res_repo: ReservationRepository, bus_repo: BusRepository):
        self.user_repository = user_repo
        self.trip_repository = trip_repo
        self.reservation_repository = res_repo
        self.bus_repository = bus_repo
    
    async def subscribe_notifications(self, user: User, trip: Trip, reservation: Reservation, background_tasks: BackgroundTasks):
            if user.profile == UserProfile.STAFF:
                if reservation.extra_passenger_name not in (None, ""):
                    background_tasks.add_task(
                        EmailUseCases().send_subscription_confirmation_staff_for_extra_name,
                        user.email, user.full_name, trip.trip_id, reservation.extra_passenger_name
                    )
                else:
                    background_tasks.add_task(
                        EmailUseCases().send_subscription_confirmation_staff,
                        user.email, user.full_name, trip.trip_id
                    )
            if user.profile == UserProfile.STUDENT:
                background_tasks.add_task(
                    EmailUseCases().send_subscription_confirmation_student,
                    user.email, user.full_name, trip.trip_id
                )

    async def activate_notifications(self, user: User, trip: Trip, reservation: Reservation, background_tasks: BackgroundTasks):
            if user.profile == UserProfile.STAFF:
                if reservation.extra_passenger_name not in (None, ""):
                    background_tasks.add_task(
                        EmailUseCases().send_reactivation_confirmation_staff_for_extra_name,
                        user.email, user.full_name, trip.trip_id, reservation.extra_passenger_name
                    )
                else:
                    background_tasks.add_task(
                        EmailUseCases().send_reactivation_confirmation_staff,
                        user.email, user.full_name, trip.trip_id
                    )
            if user.profile == UserProfile.STUDENT:
                background_tasks.add_task(
                    EmailUseCases().send_reactivation_confirmation_student,
                    user.email, user.full_name, trip.trip_id
                )

    async def cancel_subscription_notifications(self, user: User, trip: Trip, reservation: Reservation, background_tasks: BackgroundTasks):
            if user.profile == UserProfile.STAFF:
                if reservation.extra_passenger_name not in (None, ""):
                    background_tasks.add_task(
                        EmailUseCases().send_cancellation_confirmation_staff_for_extra_name,
                        user.email, user.full_name, trip.trip_id, reservation.extra_passenger_name
                    )
                else:
                    background_tasks.add_task(
                        EmailUseCases().send_cancellation_confirmation_staff,
                        user.email, user.full_name, trip.trip_id
                    )
            if user.profile == UserProfile.STUDENT:
                background_tasks.add_task(
                    EmailUseCases().send_cancellation_confirmation_student,
                    user.email, user.full_name, trip.trip_id
                )

    async def send_trip_cancelled(self, email: str, name: str, trip_id: str, trip_date: str,  background_tasks: BackgroundTasks):
        background_tasks.add_task(
                EmailUseCases().send_trip_cancelled,
                email, name, trip_id, trip_date.strftime("%d/%m/%Y")
            )
        