import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio


async def test_read_root(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "docs" in data
    assert data["version"] == "0.1.0"


async def test_health_check(client: AsyncClient):
    response = await client.get("/api/v1/health/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "healthy"
    assert data["environment"] == "development"
