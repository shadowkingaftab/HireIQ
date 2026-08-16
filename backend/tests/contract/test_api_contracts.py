from fastapi.testclient import TestClient
from proofhire.backend.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_openapi():
    response = client.get("/openapi.json")
    assert response.status_code == 200
    data = response.json()
    assert "paths" in data
    assert "/api/v1/auth/login" in data["paths"]
    assert "/api/v1/jobs" in data["paths"]
