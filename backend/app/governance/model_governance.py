import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class ModelVersion:
    model_name: str
    version: str
    provider: str
    kind: str
    enabled: bool = True
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ModelGovernance:
    def __init__(self):
        self._versions: Dict[str, ModelVersion] = {}
        self._active: Dict[str, ModelVersion] = {}

    def register_version(self, version: ModelVersion) -> None:
        key = f"{version.model_name}:{version.version}"
        self._versions[key] = version
        if version.enabled:
            self._active[version.model_name] = version
        logger.info("Registered model version %s", key)

    def activate(self, model_name: str, version: str) -> None:
        key = f"{model_name}:{version}"
        version_obj = self._versions.get(key)
        if version_obj is None:
            raise ValueError(f"Model version not found: {key}")
        for k, v in self._versions.items():
            if v.model_name == model_name:
                v.enabled = k == key
        self._active[model_name] = version_obj
        logger.info("Activated model %s version %s", model_name, version)

    def get_active(self, model_name: str) -> Optional[ModelVersion]:
        return self._active.get(model_name)

    def list_versions(self, model_name: Optional[str] = None) -> List[ModelVersion]:
        versions = list(self._versions.values())
        if model_name:
            versions = [v for v in versions if v.model_name == model_name]
        return versions


model_governance = ModelGovernance()
