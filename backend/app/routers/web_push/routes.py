from app.DTOs.web_push import DeleteWebPushSubscriptionDTO
from app.routers.users.dependencies import get_push_subscription_service
from app.services.web_push_service import PushSubscriptionService
from app.DTOs.web_push import CreateWebPushSubscriptionDTO
from fastapi import APIRouter
from app.middleware import get_current_user
from fastapi import Depends
from app.middleware import TokenData
from app.core.responses import ResponseHandler

web_push_router = APIRouter(
    prefix="/web-push",
    tags=["web-push"]
)

@web_push_router.post("/subscribe")
async def subscribe_web_push(
    data: CreateWebPushSubscriptionDTO,
    current_user: TokenData = Depends(get_current_user),
    service: PushSubscriptionService = Depends(get_push_subscription_service)
):
    result = await service.subscribe(current_user.user_id, data)
    return ResponseHandler.ok(result)
    
@web_push_router.delete("/unsubscribe")
async def unsubscribe_web_push(
    data: DeleteWebPushSubscriptionDTO,
    current_user: TokenData = Depends(get_current_user),
    service: PushSubscriptionService = Depends(get_push_subscription_service)
):
    result = await service.unsubscribe(current_user.user_id, data)
    return ResponseHandler.ok(result)