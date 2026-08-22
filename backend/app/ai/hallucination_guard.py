import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class HallucinationGuard:
    def __init__(self, router: Optional[Any] = None):
        self.router = router

    async def check(self, claim: str, evidence: str) -> Dict[str, Any]:
        if not claim.strip() or not evidence.strip():
            return {"supported": False, "confidence": 0.0, "reason": "missing_input"}
        if self.router is None:
            return {"supported": True, "confidence": 0.5, "reason": "no_guard_configured"}
        try:
            from proofhire.backend.app.ai.inference_router import TaskKind
            prompt = (
                "Determine if the claim is supported by the evidence. "
                "Return JSON with 'supported' (boolean), 'confidence' (0-1), and 'reason'.\n\n"
                f"Claim: {claim}\nEvidence: {evidence}"
            )
            result = await self.router.route(task=TaskKind.EVALUATION, payload={"prompt": prompt})
            if isinstance(result, dict):
                return {
                    "supported": bool(result.get("supported", False)),
                    "confidence": float(result.get("confidence", 0.0)),
                    "reason": result.get("reason", "unknown"),
                }
        except Exception:
            logger.exception("Hallucination check failed")
        return {"supported": False, "confidence": 0.0, "reason": "error"}

    async def batch_check(self, claims: List[str], evidence: str) -> List[Dict[str, Any]]:
        return [await self.check(claim, evidence) for claim in claims]


hallucination_guard = HallucinationGuard()
