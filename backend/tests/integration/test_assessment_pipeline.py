def test_assessment_list_uses_database(client):
    response = client.get("/api/v1/assessments/")
    assert response.status_code == 200
    assert response.json() == []


def test_assessment_creation_requires_organization_id(client):
    response = client.post("/api/v1/assessments/", json={"title": "Python"})
    assert response.status_code == 422
