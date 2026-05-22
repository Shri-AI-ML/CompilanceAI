import pytest
from httpx import AsyncClient
from app.main import app
from app.api.deps import get_current_user, CurrentUser

pytestmark = pytest.mark.asyncio


async def test_users_me_unauthenticated(client: AsyncClient):
    response = await client.get("/api/v1/users/me")
    assert response.status_code == 401


async def test_users_me_authenticated(client: AsyncClient):
    response = await client.get(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer some_valid_token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "auditor@complianceos.ai"
    assert data["name"] == "Elena Rostova"
    assert "id" in data


async def test_users_me_update(client: AsyncClient):
    response = await client.put(
        "/api/v1/users/me",
        headers={"Authorization": "Bearer some_valid_token"},
        json={"name": "Elena Rostova Updated"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Elena Rostova Updated"


async def test_organizations_active_authenticated(client: AsyncClient):
    response = await client.get(
        "/api/v1/organizations/active",
        headers={"Authorization": "Bearer some_valid_token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "complianceos"
    assert data["name"] == "ComplianceOS AI Inc."


async def test_organizations_update_authorized(client: AsyncClient):
    response = await client.put(
        "/api/v1/organizations/active",
        headers={"Authorization": "Bearer some_valid_token"},
        json={"name": "ComplianceOS Updated Org", "slug": "complianceos-updated"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "ComplianceOS Updated Org"
    assert data["slug"] == "complianceos-updated"


async def test_organizations_update_unauthorized_role(client: AsyncClient):
    # Override get_current_user dependency to return a viewer (unauthorized role)
    async def override_get_current_user():
        return CurrentUser(
            id="user_viewer",
            email="viewer@complianceos.ai",
            name="Viewer User",
            roles=["Viewer"],
            organization_id="org_1",
        )
    
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    try:
        response = await client.put(
            "/api/v1/organizations/active",
            headers={"Authorization": "Bearer some_valid_token"},
            json={"name": "Attempt Update"}
        )
        assert response.status_code == 403
        data = response.json()
        assert "Permission denied" in data["detail"]
    finally:
        del app.dependency_overrides[get_current_user]
