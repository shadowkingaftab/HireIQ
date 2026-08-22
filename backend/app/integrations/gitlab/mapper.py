from typing import Any, Dict

class GitLabMapper:
    def map_project_to_evidence(self, project: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "source": "gitlab",
            "type": "project",
            "content": project,
            "raw_id": str(project.get("id")),
        }
