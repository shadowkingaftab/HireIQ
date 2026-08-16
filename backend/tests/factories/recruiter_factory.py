from typing import Any, Dict


def build_recruiter(**overrides: Any) -> Dict[str, Any]:
    data = {
        "id": 1,
        "user_id": 1,
        "organization_id": 1,
        "title": "Senior Recruiter",
    }
    data.update(overrides)
    return data
