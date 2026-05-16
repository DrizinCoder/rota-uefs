from app.DTOs.fleet import BusCreateDTO, BusUpdateDTO
from app.routers.fleet.routes import router as fleet_router


def test_fleet_module_import():
    assert fleet_router is not None
    assert BusCreateDTO.__name__ == 'BusCreateDTO'
    assert BusUpdateDTO.__name__ == 'BusUpdateDTO'
