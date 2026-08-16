from typing import Any, Dict, Optional

class GreenhouseService:
    async def sync(self, *, api_key: str) -> Dict[str, Any]:
        return {"status": "ok"}


greenhouse_service = GreenhouseService()
