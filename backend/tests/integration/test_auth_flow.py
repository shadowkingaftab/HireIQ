def test_signup_login_and_me_round_trip(client):
    user = {
        "email": "candidate@example.com",
        "password": "correct-horse-battery-staple",
        "full_name": "Test Candidate",
    }

    signup = client.post("/api/v1/auth/signup", json=user)
    assert signup.status_code == 201
    assert signup.json()["token_type"] == "bearer"

    login = client.post(
        "/api/v1/auth/login",
        json={"username": user["email"], "password": user["password"]},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]

    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["user"]["email"] == user["email"]
    assert me.json()["user"]["role"] == "candidate"
