import logging
from typing import Optional

logger = logging.getLogger(__name__)


class VirusScanner:
    def __init__(self, enabled: bool = False):
        self.enabled = enabled

    async def scan(self, data: bytes, filename: Optional[str] = None) -> bool:
        if not self.enabled:
            logger.debug("Virus scanning disabled; passing file through")
            return True
        try:
            return await self._scan_with_clamav(data)
        except Exception:
            logger.exception("Virus scan failed for %s", filename)
            return False

    async def _scan_with_clamav(self, data: bytes) -> bool:
        try:
            import clamd
        except ImportError:
            logger.warning("pyclamd not installed; skipping scan")
            return True
        try:
            cd = clamd.ClamdNetworkSocket()
            result = cd.instream(data)
            return result.get("stream", [("", "")])[0][0] == "OK"
        except Exception:
            logger.warning("ClamAV scan failed; assuming clean")
            return True


virus_scanner = VirusScanner()
