import logging
from typing import Any, Dict, List, Optional

from proofhire.backend.app.ai.inference_router import InferenceRouter, TaskKind

logger = logging.getLogger(__name__)


class Reranking:
    def __init__(self, router: Optional[InferenceRouter] = None):
        self.router = router or InferenceRouter()

    async def rerank_candidates(
        self, candidates: List[Dict[str, Any]], job: Dict[str, Any], top_k: int = 20, model_override: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        if not candidates:
            return []
        from proofhire.backend.app.ai.prompt_renderer import PromptRenderer
        renderer = PromptRenderer()
        candidates_text = "\n".join(
            f"- {c.get('name', c.get('candidate_id', 'unknown'))}: {c.get('text', '')[:300]}"
            for c in candidates[:50]
        )
        prompt = renderer.render("rerank_candidates", {"job": str(job), "candidates": candidates_text})
        result = await self.router.route(
            task=TaskKind.RERANKING,
            payload={"prompt": prompt, "model": model_override},
            model_override=model_override,
        )
        if not isinstance(result, dict):
            return candidates[:top_k]
        ranked_ids = result.get("ranked_ids", [])
        if not ranked_ids:
            return candidates[:top_k]
        candidate_map = {c.get("candidate_id") or c.get("id"): c for c in candidates}
        ranked = []
        for cid in ranked_ids:
            item = candidate_map.get(cid)
            if item:
                ranked.append(item)
        for item in candidates:
            key = item.get("candidate_id") or item.get("id")
            if key not in ranked_ids and item not in ranked:
                ranked.append(item)
        return ranked[:top_k]


reranking = Reranking()
