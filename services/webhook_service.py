from typing import Any, Dict, Optional

class WebhookService:
    def send(self, *, event: str, payload: Dict[str, Any]) -> None:
        pass


webhook_service = WebhookService()
