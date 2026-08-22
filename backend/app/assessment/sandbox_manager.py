import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class SandboxManager:
    def __init__(self, enabled: bool = False):
        self.enabled = enabled

    async def run(self, *, code: str, language: str, timeout: int = 5) -> Dict[str, Any]:
        if not self.enabled:
            return {"stdout": "", "stderr": "sandbox disabled", "returncode": -1}
        try:
            return await self._run_subprocess(code, language, timeout)
        except Exception as exc:
            logger.exception("Sandbox execution failed")
            return {"stdout": "", "stderr": str(exc), "returncode": -1}

    async def _run_subprocess(self, code: str, language: str, timeout: int) -> Dict[str, Any]:
        import asyncio
        process = await asyncio.create_subprocess_exec(
            language,
            "-c",
            code,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        try:
            stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=timeout)
            return {"stdout": stdout.decode(), "stderr": stderr.decode(), "returncode": process.returncode}
        except asyncio.TimeoutError:
            process.kill()
            return {"stdout": "", "stderr": "timeout", "returncode": -1}


sandbox_manager = SandboxManager()
