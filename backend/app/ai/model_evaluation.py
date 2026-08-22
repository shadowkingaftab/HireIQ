import logging
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from proofhire.backend.app.ai.evaluator import EvalResult, Evaluator

logger = logging.getLogger(__name__)


@dataclass
class ModelEvalRecord:
    model_name: str
    task: str
    metrics: List[EvalResult] = field(default_factory=list)
    sample_count: int = 0
    metadata: Dict[str, Any] = field(default_factory=dict)


class ModelEvaluation:
    def __init__(self, evaluator: Optional[Evaluator] = None):
        self.evaluator = evaluator or Evaluator()
        self._records: List[ModelEvalRecord] = []

    async def evaluate_model(
        self,
        model_name: str,
        task: str,
        samples: List[Dict[str, Any]],
    ) -> ModelEvalRecord:
        all_metrics: List[EvalResult] = []
        for sample in samples:
            prompt = sample.get("prompt", "")
            response = sample.get("response", "")
            expected = sample.get("expected")
            criteria = sample.get("criteria")
            metrics = await self.evaluator.evaluate_response(
                prompt=prompt, response=response, expected=expected, criteria=criteria
            )
            all_metrics.extend(metrics)
        record = ModelEvalRecord(model_name=model_name, task=task, metrics=all_metrics, sample_count=len(samples))
        self._records.append(record)
        logger.info("Evaluated model %s on %s samples", model_name, len(samples))
        return record

    def summarize(self, model_name: Optional[str] = None, task: Optional[str] = None) -> List[Dict[str, Any]]:
        summaries = []
        for record in self._records:
            if model_name and record.model_name != model_name:
                continue
            if task and record.task != task:
                continue
            summaries.append(
                {
                    "model_name": record.model_name,
                    "task": record.task,
                    "sample_count": record.sample_count,
                    "aggregate": self.evaluator.aggregate(record.metrics),
                }
            )
        return summaries

    def clear(self) -> None:
        self._records.clear()


model_evaluation = ModelEvaluation()
