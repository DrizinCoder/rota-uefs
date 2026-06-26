from app.DTOs.web_push import DeleteWebPushSubscriptionDTO
from app.routers.users.dependencies import get_push_subscription_service
from app.services.push_notification.web_push_service import PushSubscriptionService
from app.DTOs.web_push import CreateWebPushSubscriptionDTO
from fastapi import APIRouter
from app.middleware import get_current_user
from fastapi import Depends
from app.middleware import TokenData
from app.core.responses import ResponseHandler
from app.core.exceptions import InternalServerException
from app.services.push_notification.use_cases import PushNotificationUseCases

web_push_router = APIRouter(
)

@web_push_router.post("/subscribe")
async def subscribe_web_push(
    data: CreateWebPushSubscriptionDTO,
    current_user: TokenData = Depends(get_current_user),
    service: PushSubscriptionService = Depends(get_push_subscription_service)
):
    try:
        result = await service.subscribe(current_user.sub, data)
        PushNotificationUseCases().send_welcome(current_user.sub)
    except:
        return InternalServerException("Erro na inscricao de notificacao push-up")
    
    return ResponseHandler.ok(result)
    
@web_push_router.delete("/unsubscribe")
async def unsubscribe_web_push(
    data: DeleteWebPushSubscriptionDTO,
    current_user: TokenData = Depends(get_current_user),
    service: PushSubscriptionService = Depends(get_push_subscription_service)
):
    print(f"Desinscrevendo usuário {current_user.sub} da notificação push-up...")
    result = await service.unsubscribe(current_user.sub, data)
    return ResponseHandler.ok(result)