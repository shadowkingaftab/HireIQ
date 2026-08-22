import pytest
from httpx import AsyncClient

from proofhire.backend.main import app


@pytest.mark.asyncio
async def test_evidence_ingest_and_list():
    async with AsyncClient(app=app, base_url="http://test") as client:
        ingest_resp = await client.post(
            "/api/v1/candidates/1/evidence",
            json={"source": "github", "external_id": "repo-1", "content": {"name": "example"}},
            headers={"Authorization": "Bearer candidate-token"},
        )
        assert ingest_resp.status_code in (200, 201)
        list_resp = await client.get(
            "/api/v1/candidates/1/evidence",
            headers={"Authorization": "Bearer candidate-token"},
        )
        assert list_resp.status_code == 200
