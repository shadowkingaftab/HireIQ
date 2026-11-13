def test_login_does_not_interpret_sql_as_a_query(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "admin' OR '1'='1", "password": "invalid"},
    )
    assert response.status_code == 401


def test_job_creation_requires_authentication(client):
    response = client.post("/api/v1/jobs/", json={"title": "<script>alert(1)</script>"})
    assert response.status_code == 403
