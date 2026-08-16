import logging
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class ModelInfo:
    name: str
    provider: str
    model_id: str
    kind: str
    dimensions: Optional[int] = None
    enabled: bool = True
    metadata: Dict[str, Any] = field(default_factory=dict)


class ModelRegistry:
    def __init__(self):
        self._models: Dict[str, ModelInfo] = {}
        self._register_defaults()

    def _register_defaults(self) -> None:
        defaults = [
            ModelInfo(name="text-embedding-3-small", provider="openai", model_id="text-embedding-3-small", kind="embedding", dimensions=1536),
            ModelInfo(name="gpt-4o-mini", provider="openai", model_id="gpt-4o-mini", kind="llm"),
            ModelInfo(name="claude-3-haiku", provider="anthropic", model_id="claude-3-haiku-20240307", kind="llm"),
        ]
        for model in defaults:
            self._models[model.name] = model

    def register(self, model: ModelInfo) -> None:
        self._models[model.name] = model
        logger.info("Registered model %s", model.name)

    def get(self, name: str) -> Optional[ModelInfo]:
        return self._models.get(name)

    def list_models(self, kind: Optional[str] = None) -> List[ModelInfo]:
        models = list(self._models.values())
        if kind:
            models = [m for m in models if m.kind == kind]
        return models

    def resolve(self, kind: str, preferred: Optional[str] = None) -> Optional[ModelInfo]:
        if preferred and preferred in self._models and self._models[preferred].kind == kind and self._models[preferred].enabled:
            return self._models[preferred]
        for model in self._models.values():
            if model.kind == kind and model.enabled:
                return model
        return None


model_registry = ModelRegistry()
