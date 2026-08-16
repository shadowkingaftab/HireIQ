from typing import Any, Dict, Optional
from proofhire.backend.app.integrations.base.provider import BaseProvider

class ProviderRegistry:
    def __init__(self):
        self._providers: Dict[str, BaseProvider] = {}

    def register(self, provider: BaseProvider) -> None:
        self._providers[provider.name] = provider

    def get(self, name: str) -> Optional[BaseProvider]:
        return self._providers.get(name)

    def list_providers(self) -> List[str]:
        return list(self._providers.keys())

provider_registry = ProviderRegistry()
