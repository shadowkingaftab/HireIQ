from typing import Any, Dict


class BaseProvider:
    name: str = "base"

    async def validate_credentials(self, credentials: Dict[str, Any]) -> bool:
        raise NotImplementedError

    async def fetch_data(self, query: Any) -> Any:
        raise NotImplementedError

    async def health(self) -> Dict[str, Any]:
        return {"provider": self.name, "status": "unknown"}
