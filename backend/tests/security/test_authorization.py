def test_me_requires_authentication(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 403


def test_me_rejects_invalid_bearer_token(client):
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer not-a-valid-token"},
    )
    assert response.status_code == 401
