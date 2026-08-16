import logging
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class EvalResult:
    metric: str
    score: float
    details: Dict[str, Any] = field(default_factory=dict)


class Evaluator:
    def __init__(self, router: Optional[Any] = None):
        self.router = router

    async def evaluate_response(
        self,
        prompt: str,
        response: str,
        expected: Optional[str] = None,
        criteria: Optional[List[str]] = None,
    ) -> List[EvalResult]:
        results: List[EvalResult] = []
        results.append(EvalResult(metric="length", score=min(len(response) / 500.0, 1.0), details={"length": len(response)}))
        results.append(EvalResult(metric="non_empty", score=1.0 if response.strip() else 0.0, details={"empty": not response.strip()}))
        if expected:
            overlap = self._token_overlap(response, expected)
            results.append(EvalResult(metric="token_overlap", score=overlap, details={"expected_length": len(expected)}))
        if criteria:
            for criterion in criteria:
                score = await self._llm_criterion_score(prompt, response, criterion)
                results.append(EvalResult(metric=f"criterion_{criterion}", score=score))
        return results

    def aggregate(self, results: List[EvalResult]) -> Dict[str, Any]:
        if not results:
            return {"overall": 0.0, "count": 0}
        overall = sum(r.score for r in results) / len(results)
        return {"overall": round(overall, 4), "count": len(results), "metrics": [r.metric for r in results]}

    def _token_overlap(self, response: str, expected: str) -> float:
        a = set(response.lower().split())
        b = set(expected.lower().split())
        if not a or not b:
            return 0.0
        return len(a.intersection(b)) / len(b)

    async def _llm_criterion_score(self, prompt: str, response: str, criterion: str) -> float:
        if self.router is None:
            return 0.5
        try:
            from proofhire.backend.app.ai.inference_router import TaskKind
            result = await self.router.route(
                task=TaskKind.EVALUATION,
                payload={
                    "prompt": f"Score the response against criterion '{criterion}' from 0 to 1. "
                    f"Prompt: {prompt}\nResponse: {response}\nReturn JSON with 'score'."
                },
            )
            if isinstance(result, dict):
                return float(result.get("score", 0.5))
        except Exception:
            logger.exception("LLM criterion evaluation failed")
        return 0.5


evaluator = Evaluator()
