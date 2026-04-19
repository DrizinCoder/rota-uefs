from fastapi import status


class AppException(Exception):
    def __init__(
        self,
        message: str,
        status_code: int,
        error_code: str,
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code


class BadRequestException(AppException):
    def __init__(self, message="Bad request"):
        super().__init__(message, status.HTTP_400_BAD_REQUEST, "BAD_REQUEST")


class UnauthorizedException(AppException):
    def __init__(self, message="Unauthorized"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED, "UNAUTHORIZED")


class ForbiddenException(AppException):
    def __init__(self, message="Forbidden"):
        super().__init__(message, status.HTTP_403_FORBIDDEN, "FORBIDDEN")


class NotFoundException(AppException):
    def __init__(self, message="Resource not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND, "NOT_FOUND")


class ConflictException(AppException):
    def __init__(self, message="Conflict"):
        super().__init__(message, status.HTTP_409_CONFLICT, "CONFLICT")


class UnprocessableEntityException(AppException):
    def __init__(self, message="Unprocessable entity"):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY, "UNPROCESSABLE_ENTITY")


class InternalServerException(AppException):
    def __init__(self, message="Internal server error"):
        super().__init__(message, status.HTTP_500_INTERNAL_SERVER_ERROR, "INTERNAL_ERROR")