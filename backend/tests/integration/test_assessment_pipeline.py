import pytest
from httpx import AsyncClient

from proofhire.backend.main import app


@pytest.mark.asyncio
async def test_assessment_creation_and_submission():
    async with AsyncClient(app=app, base_url="http://test") as client:
        create_resp = await client.post(
            "/api/v1/assessments",
            json={"title": "Python Assessment", "questions": [{"prompt": "2+2?", "type": "mcq", "options": ["3", "4"], "correct_index": 1}]},
            headers={"Authorization": "Bearer recruiter-token"},
        )
        assert create_resp.status_code in (200, 201)
        assessment_id = create_resp.json().get("id")
        submit_resp = await client.post(
            f"/api/v1/assessments/{assessment_id}/submit",
            json={"answers": [1]},
            headers={"Authorization": "Bearer candidate-token"},
        )
        assert submit_resp.status_code in (200, 201)
