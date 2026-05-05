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

    async def subscribe_user_to_trip(self, user_id: str, trip_id: str):
        trip = await self.trip_repository.get_by_id(trip_id)
        if not trip:
            raise NotFoundException("Viagem não encontrada")
        
        # Busca reservas com LOCK PESSIMISTA ativado -Isso trava as linhas no banco até o commit final
        reservations = await self.reservation_repository.get_by_trip_id(trip_id, with_lock=True)
        current_count = len(reservations)

        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise NotFoundException("Usuário não encontrado")

        bus = await self.bus_repository.get_by_plate(trip.bus_license_plate)
        if not bus:
            raise NotFoundException("Ônibus não encontrado")
            
        max_capacity = bus.capacity

        final_response = None

        if user.profile == UserProfile.STUDENT:
            new_res = await self.reservation_repository.create(user_id=user_id, trip_id=trip_id)
            
            if current_count >= max_capacity:
                # Módulo de notificação - Enviar email para o aluno que está lista de espera
                final_response = ResponseHandler.custom(
                    status_code=201,
                    data=new_res,
                    message="Inscrito com sucesso, mas você está na LISTA DE ESPERA (vagas excedidas)."
                )
            else:
                final_response = ResponseHandler.created(new_res, "Inscrição confirmada com sucesso.")
            
        elif user.profile == UserProfile.STAFF:
            if current_count < max_capacity:
                new_res = await self.reservation_repository.create(user_id=user_id, trip_id=trip_id)
                final_response = ResponseHandler.created(new_res, "Servidor inscrito com sucesso.")
            else:
                students_res = [r for r in reservations if r.user.profile == UserProfile.STUDENT]

                if students_res:
                    last_student_res = max(students_res, key=lambda r: r.reservation_timestamp)
                    
                    new_res = await self.reservation_repository.create(user_id=user_id, trip_id=trip_id)
                
                    final_response = ResponseHandler.custom(
                        status_code=201,
                        data=new_res,
                        message=f"Vaga garantida por prioridade. E-mail para o aluno {last_student_res.user.full_name} foi enviado informando que está na lista de espera, com possibilidade de não embarcar caso não haja desistência de vagas."
                    )
                else:
                    new_res = await self.reservation_repository.create(user_id=user_id, trip_id=trip_id)

                    # Módulo de notificação - Enviar email para administradores
                    final_response = ResponseHandler.custom(
                        status_code=201,
                        data=new_res,
                        message="Inscrito como excedente. Administradores da UNIDRAN notificados (Super lotação de servidores)."
                    )

        # O commit é obrigatório aqui para persistir os dados e LIBERAR o Lock no banco
        if final_response:
            await self.reservation_repository.session.commit()
            return final_response

        return ResponseHandler.custom(status_code=400, message="Perfil de usuário inválido para inscrição.")

    async def cancel_user_reservation(self, user_id: str, trip_id: str):
        # Implementar lógica de cancelamento aqui se necessário
        pass