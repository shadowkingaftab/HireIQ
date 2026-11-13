def test_matching_returns_not_found_for_missing_job(client):
    response = client.post(
        "/api/v1/matching/jobs/999/match",
        json={"candidate_ids": [1]},
    )
    assert response.status_code == 404


def test_matching_validates_result_limit(client):
    response = client.post(
        "/api/v1/matching/jobs/1/match",
        json={"candidate_ids": [1], "limit": 101},
    )
    assert response.status_code == 422
