from typing import Dict, Any

class GithubMapper:
    def map_repo(self, raw_repo: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "external_id": str(raw_repo.get("id")),
            "name": raw_repo.get("name"),
            "full_name": raw_repo.get("full_name"),
            "url": raw_repo.get("html_url"),
            "description": raw_repo.get("description"),
            "primary_language": raw_repo.get("language"),
            "stargazers_count": raw_repo.get("stargazers_count"),
            "forks_count": raw_repo.get("forks_count"),
        }

github_mapper = GithubMapper()
