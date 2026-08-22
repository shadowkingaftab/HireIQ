from typing import Any, Dict

class PyPiMapper:
    def map_package_to_evidence(self, package: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "source": "pypi",
            "type": "package",
            "content": package,
            "raw_id": package.get("name"),
        }
