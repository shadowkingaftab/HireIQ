from typing import Dict, Any

class GithubWebhookHandler:
    async def handle(self, payload: Dict[str, Any]):
        event_type = payload.get("event")
        # Logic to process push, pull_request, etc.
        pass

github_webhook_handler = GithubWebhookHandler()
