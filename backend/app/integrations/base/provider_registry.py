from typing import Dict, Type
from proofhire.backend.app.integrations.base.provider import BaseProvider

class ProviderRegistry:
    def __init__(self):
        self._providers: Dict[str, BaseProvider] = {}

    def register(self, name: str, provider: BaseProvider):
        self._providers[name] = provider

    def get(self, name: str) -> BaseProvider:
        if name not in self._providers:
            raise ValueError(f"Provider {name} not found")
        return self._providers[name]

provider_registry = ProviderRegistry()
