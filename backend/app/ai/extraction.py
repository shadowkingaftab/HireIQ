import logging
from typing import Any, Dict, List, Optional

from proofhire.backend.app.ai.inference_router import InferenceRouter, TaskKind

logger = logging.getLogger(__name__)


class Extraction:
    def __init__(self, router: Optional[InferenceRouter] = None):
        self.router = router or InferenceRouter()

    async def extract_skills(self, text: str, model_override: Optional[str] = None) -> List[str]:
        from proofhire.backend.app.ai.prompt_renderer import PromptRenderer
        renderer = PromptRenderer()
        prompt = renderer.render("skill_extraction", {"input": text})
        result = await self.router.route(
            task=TaskKind.EXTRACTION,
            payload={"prompt": prompt, "model": model_override},
            model_override=model_override,
        )
        if not isinstance(result, dict):
            return []
        skills = result.get("skills", [])
        return [s for s in skills if isinstance(s, str)]

    async def extract_experience(self, text: str, model_override: Optional[str] = None) -> Dict[str, Any]:
        from proofhire.backend.app.ai.prompt_renderer import PromptRenderer
        renderer = PromptRenderer()
        prompt = (
            "Extract work experience from the following text. "
            "Return JSON with 'years', 'roles' (array of strings), and 'companies' (array of strings).\n\n"
            f"Text: {text}"
        )
        result = await self.router.route(
            task=TaskKind.EXTRACTION,
            payload={"prompt": prompt, "model": model_override},
            model_override=model_override,
        )
        return result if isinstance(result, dict) else {}

    async def extract_education(self, text: str, model_override: Optional[str] = None) -> Dict[str, Any]:
        prompt = (
            "Extract education details. Return JSON with 'degrees', 'institutions', and 'years'.\n\n"
            f"Text: {text}"
        )
        result = await self.router.route(
            task=TaskKind.EXTRACTION,
            payload={"prompt": prompt, "model": model_override},
            model_override=model_override,
        )
        return result if isinstance(result, dict) else {}


extraction = Extraction()
