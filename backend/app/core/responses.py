from fastapi.responses import JSONResponse
from fastapi import status, Response

class ResponseHandler:
    @staticmethod
    def ok(data=None, message="OK"):
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": message,
                "data": data
            }
        )

    @staticmethod
    def created(data=None, message="Created"):
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "success": True,
                "message": message,
                "data": data
            }
        )

    @staticmethod
    def accepted(message="Accepted"):
        return JSONResponse(
            status_code=status.HTTP_202_ACCEPTED,
            content={
                "success": True,
                "message": message
            }
        )

    @staticmethod
    def no_content():
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    @staticmethod
    def custom(status_code: int, data=None, message=""):
        return JSONResponse(
            status_code=status_code,
            content={
                "success": True,
                "message": message,
                "data": data
            }
        )