from app.services.driver_service import DriverService
from app.DTOs.driver import DriverPatchDTO


def test_driver_module_import():
    assert hasattr(DriverService, 'update_driver')
    assert DriverPatchDTO.__name__ == 'DriverPatchDTO'
