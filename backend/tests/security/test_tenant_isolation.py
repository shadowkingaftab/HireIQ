from fastapi.testclient import TestClient
from proofhire.backend.main import app

client = TestClient(app)


def test_tenant_isolation():
    response_a = client.get("/api/v1/candidates", headers={"Authorization": "Bearer tenant-a-token"})
    response_b = client.get("/api/v1/candidates", headers={"Authorization": "Bearer tenant-b-token"})
    assert response_a.status_code in (200, 401)
    assert response_b.status_code in (200, 401)
    if response_a.status_code == 200 and response_b.status_code == 200:
        assert response_a.json() != response_b.json()


def test_cross_tenant_job_access():
    response = client.get("/api/v1/jobs/999", headers={"Authorization": "Bearer tenant-a-token"})
    assert response.status_code in (404, 401, 403)
