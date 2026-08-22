from typing import Any, Dict


def build_candidate(**overrides: Any) -> Dict[str, Any]:
    data = {
        "id": 1,
        "user_id": 1,
        "organization_id": 1,
        "summary": "Experienced engineer",
        "resume_url": "https://example.com/resume.pdf",
        "github_url": "https://github.com/example",
        "linkedin_url": "https://linkedin.com/in/example",
        "skills": ["python", "fastapi", "postgresql"],
    }
    data.update(overrides)
    return data
