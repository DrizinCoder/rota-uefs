from datetime import datetime, timedelta, timezone
from typing import Optional
import uuid
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.models.models import User
from app.enums.enums import UserProfile

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.SECRET_KEY, 
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt

    @staticmethod
    def create_token_for_user(user: User) -> dict:
        token_data = {
            "id": str(user.user_id),
            "registration_id": user.registration_id,
            "email": user.email,
            "profile": user.profile.value,
            "full_name": user.full_name
        }
        
        if user.profile == UserProfile.ADMIN and user.admin_member:
            token_data["access_level"] = user.admin_member.access_level.value
        
        elif user.profile == UserProfile.DRIVER:
            token_data["driver_id"] = str(user.user_id)
        
        elif user.profile == UserProfile.STAFF:
            token_data["staff_id"] = str(user.user_id)
            if user.staff_member:
                token_data["department"] = user.staff_member.department
                token_data["employment_type"] = user.staff_member.employment_type.value
        
        elif user.profile == UserProfile.STUDENT:
            token_data["student_id"] = str(user.user_id)
        
        access_token = AuthService.create_access_token(token_data)
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "user_id": str(user.user_id),
                "full_name": user.full_name,
                "registration_id": user.registration_id,
                "email": user.email,
                "profile": user.profile.value,
                "registration_status": user.registration_status.value
            }
        }