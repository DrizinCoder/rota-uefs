from app.repositories.user_repository import UserRepository
from app.repositories.reservation_repository import ReservationRepository
from app.repositories.trip_repository import TripRepository
from app.repositories.bus_repository import BusRepository
from app.core.exceptions import NotFoundException
from app.enums.enums import UserProfile
from app.core.responses import ResponseHandler 

class PriorityEngine:
    def __init__(self, user_repo: UserRepository, trip_repo: TripRepository, 
                 res_repo: ReservationRepository, bus_repo: BusRepository):
        self.user_repository = user_repo
        self.trip_repository = trip_repo
        self.reservation_repository = res_repo
        self.bus_repository = bus_repo


    async def get_trip_by_id(self, trip_id: str):
        return await self.trip_repository.get_by_id(trip_id)

    async def verify(self, trip_id: str):
        trip = await self.get_trip_by_id(trip_id)

        if not trip:
            raise NotFoundException("Viagem não encontrada")
        
        reservations = await self.reservation_repository.get_by_trip_id(trip_id)

        bus = await self.bus_repository.get_by_plate(trip.bus_license_plate)
        if not bus:
            raise NotFoundException("Ônibus não encontrado")
            
        max_capacity = bus.capacity
        current_count = len(reservations)

        data = {
            "trip": trip,
            "reservations": reservations,
            "bus": bus,
            "max_capacity": max_capacity,
            "current_count": current_count
            }
        
        return data
    
    def get_priority(self, profile):
        if profile == UserProfile.STAFF:
            return 0  # maior prioridade
        elif profile == UserProfile.STUDENT:
            return 1
        return 99

    async def subscribe_user_to_trip(self, user_id: str, trip_id: str, extra_name: str = None):
        data = await self.verify(trip_id)

        max_capacity = data["max_capacity"]

        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise NotFoundException("Usuário não encontrado")

        existing_res = next((r for r in data["reservations"] if r.user.id == user_id), None)
        if existing_res:
            await self.reservation_repository.activate_reservation(existing_res.id)
            return ResponseHandler.ok(message="Reserva reativada com sucesso.")
        else:
            new_res = await self.reservation_repository.create(user_id=user_id, trip_id=trip_id, extra_name=extra_name)

            updated_reservations = await self.reservation_repository.get_by_trip_id(trip_id)

            ordered_reservations = sorted(
                updated_reservations,
                key=lambda r: (self.get_priority(r.user.profile), r.reservation_timestamp)
            )

            inside_capacity = ordered_reservations[:max_capacity]
            waiting_list = ordered_reservations[max_capacity:]

            is_inside = any(r.id == new_res.id for r in inside_capacity)


            if user.profile == UserProfile.STUDENT:
                if is_inside:
                    return ResponseHandler.created(new_res, "Inscrição confirmada com sucesso.")
                else:
                    # 📧 TODO: enviar email informando que está na lista de espera
                    return ResponseHandler.custom(
                        status_code=201,
                        data=new_res,
                        message="Inscrito com sucesso, mas você está na LISTA DE ESPERA (vagas excedidas)."
                    )

            elif user.profile == UserProfile.STAFF:
                if is_inside:
                    students_inside = [
                        r for r in ordered_reservations[:max_capacity+1]
                        if r.user.profile == UserProfile.STUDENT
                    ]

                    if len(students_inside) > 0 and new_res in inside_capacity:
                        displaced_student = next(
                            (r for r in waiting_list if r.user.profile == UserProfile.STUDENT),
                            None
                        )

                        if displaced_student:
                            # 📧 TODO: enviar email avisando que perdeu a vaga
                            return ResponseHandler.custom(
                                status_code=201,
                                data=new_res,
                                message=f"Vaga garantida por prioridade. O aluno {displaced_student.user.full_name} foi movido para lista de espera."
                            )

                    return ResponseHandler.created(new_res, "Servidor inscrito com sucesso.")

                else:
                    # 📧 TODO: notificar administradores (superlotação de servidores)
                    return ResponseHandler.custom(
                        status_code=201,
                        data=new_res,
                        message="Inscrito como excedente. Administradores da UNIDRAN notificados (Super lotação de servidores)."
                    )

            else:
                return ResponseHandler.custom(
                    status_code=400,
                    message="Perfil de usuário inválido para inscrição."
                )
        
    async def cancel_user_reservation(self, user_id: str, trip_id: str):
        data = await self.verify(trip_id)

        reservations = data["reservations"]
        max_capacity = data["max_capacity"]

        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise NotFoundException("Usuário não encontrado")

        user_res = next((r for r in reservations if r.user.id == user_id), None)
        if not user_res:
            raise NotFoundException("Reserva não encontrada para este usuário")

        await self.reservation_repository.cancel_reservation(user_res.id)

        updated_reservations = await self.reservation_repository.get_by_trip_id(trip_id)

        ordered_reservations = sorted(
            updated_reservations,
            key=lambda r: (self.get_priority(r.user.profile), r.reservation_timestamp)
        )

        inside_capacity = ordered_reservations[:max_capacity]
        waiting_list = ordered_reservations[max_capacity:]

        if not waiting_list:
            return ResponseHandler.ok(message="Reserva cancelada com sucesso.")

        old_ordered = sorted(
            reservations,
            key=lambda r: (self.get_priority(r.user.profile), r.reservation_timestamp)
        )

        old_inside = old_ordered[:max_capacity]

        promoted = [
            r for r in inside_capacity
            if r.id not in [old_r.id for old_r in old_inside]
        ]

        if not promoted:
            return ResponseHandler.ok(message="Reserva cancelada com sucesso.")

        promoted_user = promoted[0]

        if promoted_user.user.profile == UserProfile.STUDENT:
            # 📧 TODO: enviar email avisando que saiu da lista de espera
            # e que pode perder a vaga caso um servidor apareça
            pass

        elif promoted_user.user.profile == UserProfile.STAFF:
            pass

        return ResponseHandler.ok(
            message="Reserva cancelada, fila reorganizada e vaga preenchida por prioridade."
        )
    
    async def alert_cancelled_trip(self, trip_id: str):
        trip = await self.get_trip_by_id(trip_id)

        if not trip:
            raise NotFoundException("Viagem não encontrada")

        reservations = trip.reservations

        for res in reservations:  
            #📧 TODO: enviar email para cada usuário informando sobre o cancelamento da viagem
            pass

        return ResponseHandler.ok(message="Viagem cancelada e usuários notificados por email.")
