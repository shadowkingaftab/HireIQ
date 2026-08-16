from fastapi.testclient import TestClient
from proofhire.backend.main import app

client = TestClient(app)


def test_sql_injection_blocked():
    payload = {"username": "admin' OR '1'='1", "password": "x"}
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code in (400, 401, 422)


def test_xss_blocked():
    payload = {"name": "<script>alert(1)</script>"}
    response = client.post("/api/v1/jobs", json=payload, headers={"Authorization": "Bearer recruiter-token"})
    assert response.status_code in (400, 401, 422)


def test_oversized_payload():
    payload = {"name": "A" * 10000}
    response = client.post("/api/v1/jobs", json=payload, headers={"Authorization": "Bearer recruiter-token"})
    assert response.status_code in (400, 401, 422)
