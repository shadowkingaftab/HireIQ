from typing import Any, Dict, List

class ProjectAnalyzer:
    def analyze(self, *, projects: List[Dict[str, Any]]) -> Dict[str, Any]:
        return {"count": len(projects), "complexity": "unknown"}


project_analyzer = ProjectAnalyzer()
