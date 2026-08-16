import logging
from typing import Any, Dict, List, Optional

from proofhire.backend.app.ai.inference_router import InferenceRouter, TaskKind

logger = logging.getLogger(__name__)


class Classification:
    def __init__(self, router: Optional[InferenceRouter] = None):
        self.router = router or InferenceRouter()

    async def classify_evidence_strength(self, evidence_text: str, model_override: Optional[str] = None) -> Dict[str, Any]:
        from proofhire.backend.app.ai.prompt_renderer import PromptRenderer
        renderer = PromptRenderer()
        prompt = renderer.render("evidence_classifier", {"evidence": evidence_text})
        result = await self.router.route(
            task=TaskKind.CLASSIFICATION,
            payload={"prompt": prompt, "model": model_override},
            model_override=model_override,
        )
        return result if isinstance(result, dict) else {"strength": "unknown"}

    async def classify_candidate_level(self, profile: Dict[str, Any], model_override: Optional[str] = None) -> Dict[str, Any]:
        prompt = (
            "Classify the candidate level as junior, mid, senior, staff, or principal. "
            "Return JSON with 'level' and 'confidence' (0-1).\n\n"
            f"Profile: {profile}"
        )
        result = await self.router.route(
            task=TaskKind.CLASSIFICATION,
            payload={"prompt": prompt, "model": model_override},
            model_override=model_override,
        )
        return result if isinstance(result, dict) else {"level": "unknown", "confidence": 0.0}

    async def classify_job_fit(self, candidate: Dict[str, Any], job: Dict[str, Any], model_override: Optional[str] = None) -> Dict[str, Any]:
        prompt = (
            "Evaluate candidate-job fit. Return JSON with 'fit_score' (0-1), 'strengths', and 'gaps'.\n\n"
            f"Candidate: {candidate}\n\nJob: {job}"
        )
        result = await self.router.route(
            task=TaskKind.CLASSIFICATION,
            payload={"prompt": prompt, "model": model_override},
            model_override=model_override,
        )
        return result if isinstance(result, dict) else {"fit_score": 0.0, "strengths": [], "gaps": []}


classification = Classification()
