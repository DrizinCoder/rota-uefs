from app.core.exceptions import AppException, BadRequestException, NotFoundException, UnauthorizedException, ConflictException


def test_custom_exceptions_have_hierarchy():
    assert issubclass(BadRequestException, AppException)
    assert issubclass(NotFoundException, AppException)
    assert issubclass(UnauthorizedException, AppException)
    assert issubclass(ConflictException, AppException)
