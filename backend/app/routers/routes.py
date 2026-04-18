from fastapi import APIRouter

from app.routers.users.routes import router as user_router
from app.routers.admin.routes import router as adm_router
from app.routers.auth.routes import router as auth_router
from app.routers.fleet.routes import router as fleet_router

router = APIRouter()

router.include_router(user_router, prefix="/users")
router.include_router(adm_router, prefix="/admin")
router.include_router(auth_router, prefix="/auth")
router.include_router(fleet_router, prefix="/fleet")