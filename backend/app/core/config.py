import os

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_DAYS: int = os.getenv("REFRESH_TOKEN_EXPIRE_DAYS")
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "360"))
    RESEND_API_KEY: str
    MAIL_FROM: str
    USE_CREDENTIALS: bool = True
    MISFIRE_GRACE_TIME: int 
    MINUTES_NOTICE: int = 120
    VALIDATE_CERTS: bool = True
    BASE_URL_FRONTEND: str = os.getenv("BASE_URL_FRONTEND")
    REGISTRATION_CODE_SECRET: str = Field(
        default="dev-registration-code-secret-altere-em-producao",
        description="Segredo HMAC para assinar códigos de registro (defina em produção).",
    )
    VAPID_PRIVATE_KEY: str
    VAPID_PUBLIC_KEY: str
    VAPID_CLAIMS_EMAIL: str

    class Config:
        env_file = ".env"
        SECRET_KEY: str = os.getenv("SECRET_KEY", "sua-chave-secreta-aqui-mude-em-producao")
        ALGORITHM: str = "HS256"
        ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "360"))

settings = Settings()
