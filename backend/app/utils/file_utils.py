import logging
import os
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)


def safe_join(base_dir: str, filename: str) -> str:
    base = Path(base_dir).resolve()
    target = (base / filename).resolve()
    if not str(target).startswith(str(base)):
        raise ValueError("Unsafe file path")
    return str(target)


def ensure_dir(path: str) -> str:
    Path(path).mkdir(parents=True, exist_ok=True)
    return path


def delete_if_exists(path: str) -> None:
    p = Path(path)
    if p.exists():
        p.unlink()
        logger.debug("Deleted file %s", path)


def file_extension(filename: str) -> str:
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


def mime_type(extension: str) -> str:
    mapping = {
        "pdf": "application/pdf",
        "txt": "text/plain",
        "html": "text/html",
        "json": "application/json",
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
    }
    return mapping.get(extension.lower(), "application/octet-stream")
