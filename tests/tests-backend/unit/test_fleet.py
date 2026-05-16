from app.DTOs.fleet import BusCreateDTO, BusUpdateDTO
from app.enums.enums import BusStatus
from app.routers.fleet.routes import router as fleet_router


def test_fleet_router_and_dtos():
    paths = [route.path for route in fleet_router.routes]
    assert "/" in paths
    assert "/{plate}" in paths

    create_dto = BusCreateDTO(bus_plate="ABC1234", capacity=30, bus_status=BusStatus.ACTIVE)
    update_dto = BusUpdateDTO(capacity=40, bus_status=BusStatus.INACTIVE)

    assert create_dto.bus_plate == "ABC1234"
    assert create_dto.capacity == 30
    assert update_dto.capacity == 40
    assert update_dto.bus_status == BusStatus.INACTIVE
