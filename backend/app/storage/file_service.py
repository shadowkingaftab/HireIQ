import logging
from typing import Optional

from proofhire.backend.app.storage.base import BaseStorage
from proofhire.backend.app.storage.local import LocalStorage
from proofhire.backend.app.storage.object_storage import ObjectStorage

logger = logging.getLogger(__name__)


class FileService:
    def __init__(self, storage: Optional[BaseStorage] = None):
        self.storage = storage or LocalStorage()

    async def save_upload(self, upload_id: str, data: bytes, filename: str, content_type: Optional[str] = None) -> str:
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "bin"
        path = f"uploads/{upload_id}.{ext}"
        return await self.storage.write(path, data, content_type=content_type)

    async def read_file(self, path: str) -> bytes:
        return await self.storage.read(path)

    async def delete_file(self, path: str) -> None:
        await self.storage.delete(path)

    async def file_exists(self, path: str) -> bool:
        return await self.storage.exists(path)

    async def get_download_url(self, path: str, expires_in: int = 3600) -> str:
        return await self.storage.signed_url(path, expires_in=expires_in)

    def storage_type(self) -> str:
        return type(self.storage).__name__


file_service = FileService()
