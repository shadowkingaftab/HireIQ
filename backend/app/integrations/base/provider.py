from abc import ABC, abstractmethod
from typing import Any, Dict, List

class BaseProvider(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    async def validate_credentials(self, credentials: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    async def fetch_data(self, query: Any) -> Any:
        pass
