from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel
from app.enums.enums import UserProfile

from app.core.config import settings
from app.core.exceptions import UnauthorizedException

security = HTTPBearer()

class TokenData(BaseModel):
    id: str  
    registration_id: str
    email: str
    profile: str
    full_name: str
    access_level: str | None = None
    driver_id: str | None = None
    staff_id: str | None = None
    student_id: str | None = None
    department: str | None = None
    employment_type: str | None = None

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> TokenData:
    token = credentials.credentials
    
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
   
        user_id = payload.get("id")
        profile = payload.get("profile")
        
        if not user_id or not profile:
            raise UnauthorizedException("Token inválido: dados do usuário ausentes")
        
        return TokenData(**payload)
    
    except JWTError as e:
        raise UnauthorizedException(f"Token inválido: {str(e)}")


def require_profile(*allowed_profiles: str):
    def profile_checker(current_user: TokenData = Depends(get_current_user)) -> TokenData:
        if current_user.profile not in allowed_profiles:
            raise HTTPException(
                status_code=403, 
                detail=f"Acesso negado. Perfis permitidos: {', '.join(allowed_profiles)}"
            )
        return current_user
    
    return profile_checker


def require_admin(current_user: TokenData = Depends(get_current_user)) -> TokenData:
    if current_user.profile != UserProfile.ADMIN:
        raise HTTPException(
            status_code=403, 
            detail="Acesso restrito a administradores"
        )
    return current_user


def require_driver(current_user: TokenData = Depends(get_current_user)) -> TokenData:
    if current_user.profile != UserProfile.DRIVER:
        raise HTTPException(
            status_code=403, 
            detail="Acesso restrito a motoristas"
        )
    return current_user


def require_staff(current_user: TokenData = Depends(get_current_user)) -> TokenData:
    if current_user.profile != UserProfile.STAFF:
        raise HTTPException(
            status_code=403, 
            detail="Acesso restrito a servidores"
        )
    return current_user


def require_student(current_user: TokenData = Depends(get_current_user)) -> TokenData:
    if current_user.profile != UserProfile.STUDENT:
        raise HTTPException(
            status_code=403, 
            detail="Acesso restrito a alunos"
        )
    return current_user