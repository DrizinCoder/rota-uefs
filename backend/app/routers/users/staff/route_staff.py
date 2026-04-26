import uuid

from fastapi.responses import RedirectResponse

from app.routers.admin.routes import get_admin_controller
from app.controllers.admin_controller import AdminController
from fastapi import APIRouter, BackgroundTasks, Depends, Query, Request
from app.middleware.auth_middleware import TokenData, get_current_user, require_admin
from fastapi import APIRouter
from app.DTOs.email import RequestEmailChangeDTO
from app.controllers.user_controller import UserController
from app.routers.users.dependencies import get_user_controller
from app.core.config import settings

staff_router = APIRouter()

from app.core.responses import ResponseHandler

@staff_router.get("/")
async def get_all_servidores(
    controller: AdminController = Depends(get_admin_controller),
    _: TokenData = Depends(require_admin)
):
    result = await controller.list_staff_status_pending()
    return ResponseHandler.ok(result)

@staff_router.post("/email-change/request")
async def request_email_change(
    request: Request,
    dados: RequestEmailChangeDTO,
    background_tasks: BackgroundTasks,
    current_user: TokenData = Depends(get_current_user),
    controller: UserController = Depends(get_user_controller)
):
    base_url = str(request.base_url).rstrip('/')
    
    user_id = uuid.UUID(current_user.sub)

    background_tasks.add_task(controller.request_email_change, user_id=user_id, new_email=dados.new_email, base_url=base_url)
    
    return ResponseHandler.ok(data={"message": "E-mail de confirmação será enviado em breve."})

@staff_router.get("/email-change/confirm")
async def confirm_email_change(
    token: str = Query(..., description="Token de confirmação de mudança de email"),
    controller: UserController = Depends(get_user_controller)
):
    await controller.confirm_email_change(token=token)

    return RedirectResponse(url=f"{settings.BASE_URL_FRONTEND}/email-change/confirm", status_code=302)
