import asyncio
from unittest.mock import AsyncMock, MagicMock

from app.repositories.route_repository import RouteRepository


def test_get_all_returns_routes():
    session = AsyncMock()
    result = MagicMock()
    scalars = MagicMock()
    scalars.all.return_value = ['route1', 'route2']
    result.scalars.return_value = scalars
    session.execute.return_value = result

    repository = RouteRepository(session)
    routes = asyncio.run(repository.get_all())

    assert routes == ['route1', 'route2']


def test_get_by_id_returns_none_when_route_not_found():
    session = AsyncMock()
    result = MagicMock()
    scalars = MagicMock()
    scalars.first.return_value = None
    result.scalars.return_value = scalars
    session.execute.return_value = result

    repository = RouteRepository(session)
    route = asyncio.run(repository.get_by_id('00000000-0000-0000-0000-000000000000'))

    assert route is None


def test_delete_returns_none_when_route_missing():
    repository = RouteRepository(AsyncMock())
    repository.get_by_id = AsyncMock(return_value=None)

    result = asyncio.run(repository.delete('00000000-0000-0000-0000-000000000000'))

    assert result is None
