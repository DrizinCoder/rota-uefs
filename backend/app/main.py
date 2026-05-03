from app.middleware.log_middleware import LogMiddleware
import logging

from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.responses import RedirectResponse
from app.routers.routes import router
from app.database.db import init_db, engine
from app.core.handlers import register_exception_handlers
from app.core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from app.core.logger_config import setup_app_logging

setup_app_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Iniciando aplicação...")
    await init_db()
    logger.info("✅ Aplicação iniciada...")
    yield
    logger.info("🧱 Encerrando aplicação...")
    await engine.dispose()
    logger.info("🛑 Aplicação encerrada...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,                 
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LogMiddleware)

register_exception_handlers(app)

app.include_router(router)

@app.get("/")
async def health_check():
    return RedirectResponse(url=f"{settings.BASE_URL_FRONTEND}")