import hashlib
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from proofhire.backend.app.storage.base import BaseStorage

logger = logging.getLogger(__name__)


class LocalStorage(BaseStorage):
    def __init__(self, root_dir: str = "/tmp/proofhire"):
        self.root_dir = Path(root_dir)
        self.root_dir.mkdir(parents=True, exist_ok=True)

    async def write(self, path: str, data: bytes, content_type: Optional[str] = None) -> str:
        full_path = self.root_dir / path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_bytes(data)
        return str(full_path)

    async def read(self, path: str) -> bytes:
        full_path = self.root_dir / path
        return full_path.read_bytes()

    async def delete(self, path: str) -> None:
        full_path = self.root_dir / path
        if full_path.exists():
            full_path.unlink()

    async def exists(self, path: str) -> bool:
        return (self.root_dir / path).exists()

    async def signed_url(self, path: str, expires_in: int = 3600) -> str:
        return str(self.root_dir / path)

    def path_hash(self, data: bytes) -> str:
        return hashlib.sha256(data).hexdigest()

    async def cleanup_old(self, older_than_days: int = 30) -> int:
        cutoff = datetime.now(timezone.utc).timestamp() - (older_than_days * 86400)
        removed = 0
        for file_path in self.root_dir.rglob("*"):
            if file_path.is_file() and file_path.stat().st_mtime < cutoff:
                file_path.unlink()
                removed += 1
        return removed


local_storage = LocalStorage()
