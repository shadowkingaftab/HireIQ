import pytest
from httpx import AsyncClient

from proofhire.backend.main import app


@pytest.mark.asyncio
async def test_job_matching_flow():
    async with AsyncClient(app=app, base_url="http://test") as client:
        match_resp = await client.post(
            "/api/v1/jobs/1/match",
            json={"candidate_ids": [1, 2]},
            headers={"Authorization": "Bearer recruiter-token"},
        )
        assert match_resp.status_code in (200, 201)
        if match_resp.status_code == 200:
            results = match_resp.json()
            assert isinstance(results, list)
