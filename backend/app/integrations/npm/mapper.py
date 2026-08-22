from typing import Any, Dict

class NpmMapper:
    def map_package_to_evidence(self, package: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "source": "npm",
            "type": "package",
            "content": package,
            "raw_id": package.get("name"),
        }
