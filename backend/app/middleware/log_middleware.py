import time
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

logger = logging.getLogger(__name__)

class LogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        response = await call_next(request)
        
        process_time = (time.time() - start_time) * 1000
        
        logger.info(
            f"Method: {request.method} | Path: {request.url.path} | "
            f"Status: {response.status_code} | Time: {process_time:.2f}ms"
        )
        
        return response