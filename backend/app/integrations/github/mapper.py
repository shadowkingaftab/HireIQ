from typing import Any, Dict

class GitHubMapper:
    def map_repo_to_evidence(self, repo: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "source": "github",
            "type": "repository",
            "content": repo,
            "raw_id": str(repo.get("id")),
        }


github_mapper = GitHubMapper()
