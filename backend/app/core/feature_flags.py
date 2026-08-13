from typing import Dict, Optional
from proofhire.backend.app.core.config import settings

class FeatureFlags:
    def __init__(self):
        # In a real app, these might come from Redis or a DB
        self._flags = {
            "SKILL_GRAPH_ENABLED": True,
            "GITHUB_IMPORT_ENABLED": True,
            "AI_MATCHING_ENABLED": False,
        }

    def is_enabled(self, flag_name: str) -> bool:
        return self._flags.get(flag_name, False)

feature_flags = FeatureFlags()
