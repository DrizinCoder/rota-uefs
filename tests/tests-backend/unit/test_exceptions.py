from app.core.exceptions import AppException, BadRequestException, NotFoundException


def test_exception_types_exist():
    assert issubclass(BadRequestException, AppException)
    assert issubclass(NotFoundException, AppException)
