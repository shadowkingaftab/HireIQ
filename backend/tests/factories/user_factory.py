from typing import Any, Dict


def build_user(**overrides: Any) -> Dict[str, Any]:
    data = {
        "id": 1,
        "email": "test@example.com",
        "full_name": "Test User",
        "is_active": True,
        "is_superuser": False,
        "hashed_password": "hashed_secret",
    }
    data.update(overrides)
    return data
