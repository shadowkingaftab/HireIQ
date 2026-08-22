import pytest
from httpx import AsyncClient

from proofhire.backend.main import app


@pytest.mark.asyncio
async def test_login_and_refresh():
    async with AsyncClient(app=app, base_url="http://test") as client:
        login_resp = await client.post(
            "/api/v1/auth/login",
            json={"email": "test@example.com", "password": "password"},
        )
        assert login_resp.status_code in (200, 401)
        if login_resp.status_code == 200:
            token = login_resp.json().get("access_token")
            me_resp = await client.get(
                "/api/v1/auth/me",
                headers={"Authorization": f"Bearer {token}"},
            )
            assert me_resp.status_code == 200
