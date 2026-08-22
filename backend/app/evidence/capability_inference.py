import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class CapabilityInference:
    def infer_capabilities(self, *, skills: List[str]) -> List[Dict[str, Any]]:
        if not skills:
            return []
        try:
            from proofhire.backend.app.ai.inference_router import InferenceRouter, TaskKind
            router = InferenceRouter()
            prompt = f"Infer higher-level capabilities from these skills: {', '.join(skills)}. Return JSON with 'capabilities' array."
            result = router.route(task=TaskKind.EXTRACTION, payload={"prompt": prompt})
            if isinstance(result, dict):
                capabilities = result.get("capabilities", [])
                return [{"name": c, "source": "inferred", "confidence": 0.7} for c in capabilities if isinstance(c, str)]
        except Exception:
            logger.exception("Capability inference failed")
        return []


capability_inference = CapabilityInference()
