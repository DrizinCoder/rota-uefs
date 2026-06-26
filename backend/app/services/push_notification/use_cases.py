from app.core.config import settings
import uuid
from app.models.models import Admin, User
from .web_push_service import PushSubscriptionService
from app.core.exceptions import InternalServerException
import logging

logger = logging.getLogger(__name__)

class PushNotificationUseCases:
    def __init__(self):
        self.push_sub_service = PushSubscriptionService()

    def send_quorum_not_reached_notification(self, user_id: uuid.UUID, trip_name: str):
        try:
            self.push_sub_service.send_to_user(
                user_id, 
                "⚠️ Alerta de Quórum", 
                f"A viagem {trip_name} não atingiu o quórum mínimo necessário."
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar notificação push de quórum: {str(e)}"
            )

    def send_welcome(self, user_id: uuid.UUID):
        try:

            self.push_sub_service.send_to_user(
                user_id, 
                "Bem-vindo ao Rota UEFS 🚍", 
                f"Aproveite!"
            )

        except Exception as e:
            return InternalServerException(
                message=f"Erro ao enviar notificação push: {str(e)}"
            )
        
    def send_cancellation_confirmation_driver(self, user_id: uuid.UUID, trip_name: str):
        try:
            self.push_sub_service.send_to_user(
                user_id, 
                "Confirmação de cancelamento - Rota UEFS 🚍", 
                f"Informamos que sua participação na viagem {trip_name} cancelada pelo motorista devido à ausência no momento do embarque. \nSe o cancelamento ocorreu de forma indevida, entre em contato com a equipe responsável."
            )

        except Exception as e:
            logger.error(f"Erro notificacao push-up cancelamento motorista: {e}")

    # def send_recover_password(self, user_id: uuid.UUID, name: str, token: str):
    #     try:
    #         self.push_sub_service.send_to_user(
    #             user_id, 
    #             "Recuperação de Senha - Rota UEFS 🚍", 
    #             f"Acesse seu email para fazer a recuperação da senha"
    #         )

    #     except Exception as e:
    #         raise InternalServerException(
    #             message=f"Erro ao enviar notificacao de recup. senha: {str(e)}"
    #         )

    # def send_email_change_confirmation(self, user_id: uuid.UUID):
    #     try:
    #         self.push_sub_service.send_to_user(
    #             user_id, 
    #             "Alteração de Email - Rota UEFS 🚍", 
    #             f"Acesse seu antigo endereço de email para realizar a modificação."
    #         )

    #     except Exception as e:
    #         return InternalServerException(message=f"Erro ao enviar push-up confirmação de troca de email: {str(e)}")

    # def send_account_confirmation(self, email: str, first_name: str, link: str):
    #     try:
    #         html = self.template_service.render(
    #             "account_confirmation.html",
    #             {
    #                 "link": link,
    #                 "first_name": first_name
    #             }
    #         )

    #         self.email_service.send(
    #             subject=f"{first_name}, ative sua conta no Rota UEFS",
    #             email_to=email,
    #             html_content=html
    #         )

    #     except Exception as e:
    #         raise InternalServerException(
    #             message=f"Erro ao enviar email de confirmação de conta: {str(e)}"
    #         )

    def send_trip_cancelled(self, user_id: uuid.UUID, trip_name: str, trip_date: str):
        try:
            self.push_sub_service.send_to_user(
                user_id, 
                "Viagem cancelada - Rota UEFS 🚍", 
                f"Informamos que Infelizmente, a viagem {trip_name} agendada para {trip_date} foi cancelada. \nPor favor, procure consultar outras rotas disponíveis ou entre em contato com o suporte para mais informações."
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar notificacao push-up de cancelamento de viagem: {str(e)}"
            )

    def send_subscription_confirmation_staff(self, user_id: uuid.UUID, name: str, trip_name: str):
        try:
            self.push_sub_service.send_to_user(
                user_id, 
                "Inscrição confirmada - Rota UEFS 🚍", 
                f"Sua inscrição na viagem {trip_name} foi realizada com sucesso!"
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar notificação de lista de espera: {str(e)}"
            )
    
    def send_subscription_confirmation_staff_for_extra_name(self, user_id: uuid.UUID, trip_name: str, extra_name: str):
        try:
            self.push_sub_service.send_to_user(
                user_id, 
                "Inscrição confirmada - Rota UEFS 🚍", 
                f"A inscrição de {extra_name} na viagem {trip_name} foi realizada com sucesso!"
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar notificação de lista de espera: {str(e)}"
            )

    def send_subscription_confirmation_student(self, user_id: uuid.UUID, name: str, trip_name: str):
        try:
            self.push_sub_service.send_to_user(
                user_id, 
                "Inscrição confirmada - Rota UEFS 🚍", 
                f"Confirmada sua solicitação de vaga para viagem {trip_name}!\nLembramos que, de acordo com as normas do Rota UEFS, as vagas são ocupadas prioritariamente por servidores. Caso o limite de vagas seja atingido por professores/staff, sua inscrição poderá ser movida automaticamente para a lista de espera."
            )

        except Exception as e:
            raise InternalServerException(
                message=f"Erro ao enviar notificação de lista de espera: {str(e)}"
            )
        

    def send_reactivation_confirmation_staff(self, user_id: uuid.UUID, trip_name: str):
        try:
            self.push_sub_service.send_to_user(
                user_id, 
                "Reserva reativada - Rota UEFS 🚍", 
                f"Informamos que sua reserva para a viagem { trip_name } foi reativada com sucesso!"
            )

        except Exception as e:
            logger.error(f"Erro notificacao reativação staff: {e}")

    def send_reactivation_confirmation_staff_for_extra_name(self, user_id: uuid.UUID, trip_name: str, extra_name: str):
        try:

            self.push_sub_service.send_to_user(
                user_id, 
                "Reserva reativada - Rota UEFS 🚍", 
                f"Informamos que a reserva de {extra_name} para a viagem { trip_name } foi reativada com sucesso!"
            )

        except Exception as e:
            logger.error(f"Erro notificacao reativação extra: {e}")

    def send_reactivation_confirmation_student(self, user_id: uuid.UUID, trip_name: str):
        try:
            self.push_sub_service.send_to_user(
                user_id, 
                "Reserva reativada - Rota UEFS 🚍", 
                f"Boas notícias! Sua reserva para { trip_name } foi reativada. Sua vaga está garantida novamente no sistema"
            )

        except Exception as e:
            logger.error(f"Erro notificacao reativação estudante: {e}")

    def send_cancellation_confirmation_staff(self, user_id: uuid.UUID, trip_name: str):
        try:
            self.push_sub_service.send_to_user(
                user_id, 
                "Reserva cancelada - Rota UEFS 🚍"
                f"Confirmamos o cancelamento da sua reserva para a viagem { trip_name }."
            )
        except Exception as e:
            logger.error(f"Erro notificacao cancelamento staff: {e}")

    async def send_cancellation_confirmation_staff_for_extra_name(self, user_id: uuid.UUID, trip_name: str, extra_name: str):
        try:
            self.push_sub_service.send_to_user(
                user_id, 
                "Reserva cancelada - Rota UEFS 🚍"
                f"Confirmamos o cancelamento da reserva de {extra_name} para a viagem { trip_name }."
            )
        except Exception as e:
            logger.error(f"Erro notificacao cancelamento staff: {e}")
        
    async def send_cancellation_confirmation_student(self, user_id: uuid.UUID, trip_name: str):
        try:
            self.push_sub_service.send_to_user(
                user_id, 
                "Reserva cancelada - Rota UEFS 🚍"
                f"Sua reserva para { trip_name } foi cancelada com sucesso."
            )

        except Exception as e:
            logger.error(f"Erro notificacao cancelamento estudante: {e}")
        
    # def send_boarding_qr_code(
    #     self,
    #     email: str,
    #     first_name: str,
    #     position: int,
    #     boarding_point: str,
    #     drop_off_point: str,
    #     trip_date: str,
    #     departure_time: str,
    #     reservation_id: uuid.UUID,
    #     trip_id: uuid.UUID,
    #     registration_id: str,
    #     student_mode: bool = False,
    # ):
    #     try:
    #         code = generate_registration_code(reservation_id, trip_id, registration_id)
    #         qr_base64 = generate_qr_code_base64(code)

    #         html = self.template_service.render(
    #             "boarding_qr_code.html",
    #             {
    #                 "first_name": first_name,
    #                 "position": position,
    #                 "boarding_point": boarding_point,
    #                 "drop_off_point": drop_off_point,
    #                 "trip_date": trip_date,
    #                 "departure_time": departure_time,
    #                 "qr_code_base64": qr_base64,
    #                 "student_mode": student_mode,
    #                 "in_boarding_list": position < 45,
    #             }
    #         )

    #         self.email_service.send_with_inline_image(
    #             subject="Seu QR Code de Embarque - Rota UEFS 🚍",
    #             email_to=email,
    #             html_content=html,
    #             image_base64=qr_base64,
    #             image_cid="boarding_qr_code",
    #         )

    #     except Exception as e:
    #         raise InternalServerException(
    #             message=f"Erro ao enviar email: {str(e)}"
    #         )
