from typing import Any, Dict


def build_job(**overrides: Any) -> Dict[str, Any]:
    data = {
        "id": 1,
        "organization_id": 1,
        "recruiter_id": 1,
        "title": "Backend Engineer",
        "description": "Build APIs",
        "requirements": "Python, FastAPI",
        "location": "Remote",
        "salary_min": 80000,
        "salary_max": 120000,
        "status": "open",
    }
    data.update(overrides)
    return data
