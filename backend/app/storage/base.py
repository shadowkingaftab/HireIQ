from abc import ABC, abstractmethod
from typing import BinaryIO, Optional


class BaseStorage(ABC):
    @abstractmethod
    async def write(self, path: str, data: bytes, content_type: Optional[str] = None) -> str:
        raise NotImplementedError

    @abstractmethod
    async def read(self, path: str) -> bytes:
        raise NotImplementedError

    @abstractmethod
    async def delete(self, path: str) -> None:
        raise NotImplementedError

    @abstractmethod
    async def exists(self, path: str) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def signed_url(self, path: str, expires_in: int = 3600) -> str:
        raise NotImplementedError
