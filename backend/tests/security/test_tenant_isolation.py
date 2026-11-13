def test_unknown_user_token_cannot_access_protected_identity(client):
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer tenant-a-token"},
    )
    assert response.status_code == 401


def test_nonexistent_job_does_not_expose_a_record(client):
    response = client.get("/api/v1/jobs/999")
    assert response.status_code == 404
