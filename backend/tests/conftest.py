import asyncio
from unittest.mock import AsyncMock, MagicMock
# pyrefly: ignore [missing-import]
import pytest
# pyrefly: ignore [missing-import]
import pytest_asyncio
# pyrefly: ignore [missing-import]
from httpx import ASGITransport, AsyncClient
from app.main import app
from app.api.deps import get_db


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture
async def client():
    # Create a mock database session that resolves successfully for health check
    async def override_get_db():
        mock_session = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar.return_value = 1
        mock_session.execute.return_value = mock_result
        yield mock_session

    app.dependency_overrides[get_db] = override_get_db
    
    # Use AsyncClient with ASGITransport
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as ac:
        yield ac
        
    app.dependency_overrides.clear()
