from fastapi import BackgroundTasks, logger
from app.repositories.user_repository import UserRepository
from app.repositories.reservation_repository import ReservationRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.bus_repository import BusRepository
from app.core.exceptions import NotFoundException
from app.enums.enums import UserProfile
from app.core.responses import ResponseHandler
from app.services.email.use_cases import EmailUseCases
from app.services.push_notification.use_cases import PushNotificationUseCases
from app.models.models import Reservation, Trip, User
from app.repositories.web_push_repository import PushSubscriptionRepository 

class Notifications:
    def __init__(self, user_repo: UserRepository, trip_repo: TripRepository, res_repo: ReservationRepository, bus_repo: BusRepository, pushup_repo: PushSubscriptionRepository):
        self.user_repository = user_repo
        self.trip_repository = trip_repo
        self.reservation_repository = res_repo
        self.bus_repository = bus_repo
        self.notification = PushNotificationUseCases(pushup_repo)
    
    
    async def send_quorum_not_reached_notification(self, trip: Trip, background_tasks: BackgroundTasks):
        admins = await self.user_repository.list_all_admins_full()
        result = await self.trip_repository.get_name_route_by_trip_id(trip.trip_id)
        trip_name = result[0]["route_name"] if result else trip.trip_id

        for admin in admins:
            background_tasks.add_task(
                EmailUseCases().send_quorum_not_reached_notification,
                admin.user.email,
                admin.user.full_name,
                trip_name,
            )
            
            await self.notification.send_quorum_not_reached_notification(admin.admin_id, trip_name)
            
        
    
    async def subscribe_notifications(
        self, user: User, 
        trip: Trip, 
        reservation: Reservation, 
        background_tasks: BackgroundTasks, 
        position: int
    ):
            result = await self.trip_repository.get_name_route_by_trip_id(trip.trip_id)
            trip_name = result[0]["route_name"] if result else trip.trip_id

            if user.profile == UserProfile.STAFF:
                if reservation.extra_passenger_name not in (None, ""):
                    background_tasks.add_task(
                        EmailUseCases().send_boarding_qr_code,
                        user.email, user.full_name, position, trip.route.boarding_point, trip.route.drop_off_point, trip.trip_date, trip.departure_time.strftime("%H:%M"), reservation.reservation_id, trip.trip_id, user.registration_id
                    )
                    
                    await self.notification.send_subscription_confirmation_staff_for_extra_name(user.user_id, trip_name, reservation.extra_passenger_name)
                else:
                    background_tasks.add_task(
                        EmailUseCases().send_boarding_qr_code,
                        user.email, user.full_name, position, trip.route.boarding_point, trip.route.drop_off_point, trip.trip_date, trip.departure_time.strftime("%H:%M"), reservation.reservation_id, trip.trip_id, user.registration_id
                    )

                    await self.notification.send_subscription_confirmation_staff(user.user_id, user.full_name, trip_name)
            if user.profile == UserProfile.STUDENT:
                background_tasks.add_task(
                        EmailUseCases().send_boarding_qr_code,
                        user.email, user.full_name, position, trip.route.boarding_point, trip.route.drop_off_point, trip.trip_date, trip.departure_time.strftime("%H:%M"), reservation.reservation_id, trip.trip_id, user.registration_id, True
                    )
                
                await self.notification.send_subscription_confirmation_student(user.user_id, user.full_name, trip_name)
            
            # await self.notification.send_cancellation_confirmation_student(user.user_id, trip_name)

    async def activate_notifications(self, user: User, trip: Trip, reservation: Reservation, background_tasks: BackgroundTasks):
            trip_name = trip.route.name if trip.route and trip.route.name else str(trip.trip_id)

            if user.profile == UserProfile.STAFF:
                if reservation.extra_passenger_name not in (None, ""):
                    background_tasks.add_task(
                        EmailUseCases().send_reactivation_confirmation_staff_for_extra_name,
                        user.email, user.full_name, trip_name, reservation.extra_passenger_name
                    )

                    await self.notification.send_reactivation_confirmation_staff_for_extra_name(user.user_id, trip_name, reservation.extra_passenger_name)
                else:
                    background_tasks.add_task(
                        EmailUseCases().send_reactivation_confirmation_staff,
                        user.email, user.full_name, trip_name
                    )
                    
                    await self.notification.send_reactivation_confirmation_staff(user.user_id, trip_name)
            if user.profile == UserProfile.STUDENT:
                background_tasks.add_task(
                    EmailUseCases().send_reactivation_confirmation_student,
                    user.email, user.full_name, trip_name
                )
                
                await self.notification.send_reactivation_confirmation_student(user.user_id, trip_name)

    async def cancel_subscription_notifications(self, user: User, profile: UserProfile ,trip: Trip, reservation: Reservation, background_tasks: BackgroundTasks):
            result = await self.trip_repository.get_name_route_by_trip_id(trip.trip_id)
            trip_name = result[0]["route_name"] if result else trip.trip_id

            if profile == UserProfile.STAFF:
                if reservation.extra_passenger_name not in (None, ""):
                    background_tasks.add_task(
                        EmailUseCases().send_cancellation_confirmation_staff_for_extra_name,
                        user.email, user.full_name, trip_name, reservation.extra_passenger_name
                    )

                    await self.notification.send_cancellation_confirmation_staff_for_extra_name(user.user_id, trip_name, reservation.extra_passenger_name)
                    
                else:
                    background_tasks.add_task(
                        EmailUseCases().send_cancellation_confirmation_staff,
                        user.email, user.full_name, trip_name
                    )
                    
                    await self.notification.send_cancellation_confirmation_staff(user.user_id, trip_name)
            
            if profile == UserProfile.STUDENT:
                background_tasks.add_task(
                    EmailUseCases().send_cancellation_confirmation_student,
                    user.email, user.full_name, trip_name
                )
                
                await self.notification.send_cancellation_confirmation_student(user.user_id, trip_name)
                
            if profile == UserProfile.DRIVER:
                background_tasks.add_task(
                    EmailUseCases().send_cancellation_confirmation_driver, user.email, user.full_name, trip.trip_id
                )

                
                await self.notification.send_cancellation_confirmation_driver(user.user_id, trip.trip_id)

    async def send_trip_cancelled(self, user: User, trip: Trip,  background_tasks: BackgroundTasks):
            trip_name = trip.route.name if trip.route and trip.route.name else str(trip.trip_id)

            background_tasks.add_task(
                EmailUseCases().send_trip_cancelled,
                user.email, user.full_name, trip_name, trip.trip_date.strftime("%d/%m/%Y")
            )
            
            await self.notification.send_trip_cancelled(user.user_id, trip_name, trip.trip_date.strftime("%d/%m/%Y"))
