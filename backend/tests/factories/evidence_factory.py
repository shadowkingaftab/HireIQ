from typing import Any, Dict


def build_evidence(**overrides: Any) -> Dict[str, Any]:
    data = {
        "id": 1,
        "candidate_id": 1,
        "type": "github",
        "external_id": "repo-1",
        "content": {"name": "example-repo", "stars": 10},
        "verified": False,
    }
    data.update(overrides)
    return data
