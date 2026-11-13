def test_integrations_endpoint_returns_current_connections(client):
    response = client.get("/api/v1/integrations/")
    assert response.status_code == 200
    assert response.json() == []
