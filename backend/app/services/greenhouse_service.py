from typing import Any, Dict


class GreenhouseService:
    async def sync(self, *, api_key: str) -> Dict[str, Any]:
        return {"status": "ok"}


greenhouse_service = GreenhouseService()
