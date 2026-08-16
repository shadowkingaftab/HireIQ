from typing import Dict, Optional
from proofhire.backend.app.core.config import settings


class FeatureFlags:
    def __init__(self):
        self._flags: Dict[str, bool] = {
            "SKILL_GRAPH_ENABLED": True,
            "GITHUB_IMPORT_ENABLED": True,
            "AI_MATCHING_ENABLED": False,
            "ADAPTIVE_ASSESSMENT_ENABLED": True,
            "EVIDENCE_V2_ENABLED": False,
        }

    def is_enabled(self, flag_name: str) -> bool:
        return self._flags.get(flag_name, False)

    def set_flag(self, flag_name: str, value: bool) -> None:
        self._flags[flag_name] = value

    def all_flags(self) -> Dict[str, bool]:
        return dict(self._flags)


feature_flags = FeatureFlags()
