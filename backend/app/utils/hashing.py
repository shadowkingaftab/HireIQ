import hashlib
import hmac
import logging
from typing import Optional

logger = logging.getLogger(__name__)


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_hex(data: str) -> str:
    return sha256(data.encode("utf-8"))


def hmac_sha256(key: str, message: str) -> str:
    return hmac.new(key.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).hexdigest()


def generate_fingerprint(*parts: str) -> str:
    raw = "|".join(parts)
    return sha256_hex(raw)
