import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


class GitHubWebhookHandler:
    async def handle(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        event_type = payload.get("action")
        logger.info("Handling GitHub webhook: %s", event_type)
        return {"received": True}


github_webhook_handler = GitHubWebhookHandler()
