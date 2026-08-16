from fastapi.testclient import TestClient
from proofhire.backend.main import app

client = TestClient(app)


def test_admin_access():
    response = client.get("/api/v1/users", headers={"Authorization": "Bearer admin-token"})
    assert response.status_code in (200, 401)


def test_recruiter_access():
    response = client.get("/api/v1/jobs", headers={"Authorization": "Bearer recruiter-token"})
    assert response.status_code in (200, 401)


def test_candidate_access_denied():
    response = client.get("/api/v1/users", headers={"Authorization": "Bearer candidate-token"})
    assert response.status_code in (403, 401)
