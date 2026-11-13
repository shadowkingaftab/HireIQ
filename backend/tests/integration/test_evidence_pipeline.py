def test_evidence_list_uses_database(client):
    response = client.get("/api/v1/evidence/candidates/1")
    assert response.status_code == 200
    assert response.json() == []


def test_evidence_creation_rejects_missing_required_fields(client):
    response = client.post("/api/v1/evidence/candidates/1", json={"content": {}})
    assert response.status_code == 422
