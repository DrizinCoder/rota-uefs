from fastapi.responses import JSONResponse
from fastapi import status, Response
from fastapi.encoders import jsonable_encoder
from typing import Any, Optional

class ResponseHandler:
    @staticmethod
    def _build_response(status_code: int, success: bool, message: str, data: Any = None) -> JSONResponse:
        content = {
            "success": success,
            "message": message,
        }
        
        if data is not None:
            content["data"] = jsonable_encoder(data)
            
        return JSONResponse(status_code=status_code, content=content)

    @staticmethod
    def ok(data: Any = None, message: str = "OK") -> JSONResponse:
        return ResponseHandler._build_response(
            status_code=status.HTTP_200_OK,
            success=True,
            message=message,
            data=data
        )

    @staticmethod
    def created(data: Any = None, message: str = "Created") -> JSONResponse:
        return ResponseHandler._build_response(
            status_code=status.HTTP_201_CREATED,
            success=True,
            message=message,
            data=data
        )

    @staticmethod
    def accepted(message: str = "Accepted") -> JSONResponse:
        return ResponseHandler._build_response(
            status_code=status.HTTP_202_ACCEPTED,
            success=True,
            message=message
        )

    @staticmethod
    def no_content() -> Response:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    @staticmethod
    def custom(status_code: int, data: Any = None, message: str = "") -> JSONResponse:
        return ResponseHandler._build_response(
            status_code=status_code,
            success=True,
            message=message,
            data=data
        )