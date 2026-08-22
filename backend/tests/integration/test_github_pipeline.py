import pytest
from httpx import AsyncClient

from proofhire.backend.main import app


@pytest.mark.asyncio
async def test_github_ingestion_flow():
    async with AsyncClient(app=app, base_url="http://test") as client:
        ingest_resp = await client.post(
            "/api/v1/integrations/github/ingest",
            json={"username": "example", "repositories": [{"name": "repo-1", "language": "Python"}]},
            headers={"Authorization": "Bearer candidate-token"},
        )
        assert ingest_resp.status_code in (200, 201)
