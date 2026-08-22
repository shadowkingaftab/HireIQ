from typing import Any, Dict

class BitbucketMapper:
    def map_repo_to_evidence(self, repo: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "source": "bitbucket",
            "type": "repository",
            "content": repo,
            "raw_id": str(repo.get("id")),
        }
