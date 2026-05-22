import asyncio
from unittest.mock import AsyncMock, MagicMock

import pytest
from app.core.exceptions import NotFoundException
from app.services.route_service import RouteService


def test_create_returns_json_payload():
    route = MagicMock()
    route.model_dump.return_value = {'name': 'Rota Test'}

    repository = AsyncMock()
    repository.create.return_value = route
    service = RouteService(repository)

    response = asyncio.run(service.create(MagicMock()))

    assert response == {'name': 'Rota Test'}


def test_get_all_raises_when_no_routes_found():
    repository = AsyncMock()
    repository.get_all.return_value = []
    service = RouteService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.get_all())


def test_get_by_id_returns_json_payload():
    route = MagicMock()
    route.model_dump.return_value = {'route_id': '1'}

    repository = AsyncMock()
    repository.get_by_id.return_value = route
    service = RouteService(repository)

    result = asyncio.run(service.get_by_id('00000000-0000-0000-0000-000000000000'))

    assert result == {'route_id': '1'}


def test_update_full_returns_json_payload():
    route = MagicMock()
    route.model_dump.return_value = {'route_id': '1'}

    repository = AsyncMock()
    repository.update_full.return_value = route
    service = RouteService(repository)

    result = asyncio.run(service.update_full('00000000-0000-0000-0000-000000000000', MagicMock()))

    assert result == {'route_id': '1'}


def test_delete_returns_json_payload():
    route = MagicMock()
    route.model_dump.return_value = {'route_id': '1'}

    repository = AsyncMock()
    repository.delete.return_value = route
    service = RouteService(repository)

    result = asyncio.run(service.delete('00000000-0000-0000-0000-000000000000'))

    assert result == {'route_id': '1'}


def test_patch_raises_when_route_not_found():
    repository = AsyncMock()
    repository.patch.return_value = None
    service = RouteService(repository)

    with pytest.raises(NotFoundException):
        asyncio.run(service.patch('00000000-0000-0000-0000-000000000000', MagicMock()))
