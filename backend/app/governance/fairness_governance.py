import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class FairnessMetric:
    metric_id: str
    name: str
    description: str
    threshold: float
    direction: str = "max"
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class FairnessReport:
    report_id: str
    metric_id: str
    value: float
    threshold: float
    passed: bool
    details: Dict[str, Any] = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class FairnessGovernance:
    def __init__(self):
        self._metrics: Dict[str, FairnessMetric] = {}
        self._reports: List[FairnessReport] = []

    def register_metric(self, metric: FairnessMetric) -> None:
        self._metrics[metric.metric_id] = metric
        logger.info("Registered fairness metric %s", metric.metric_id)

    def evaluate(self, metric_id: str, value: float, details: Optional[Dict[str, Any]] = None) -> FairnessReport:
        metric = self._metrics.get(metric_id)
        if metric is None:
            raise ValueError(f"Fairness metric not found: {metric_id}")
        if metric.direction == "max":
            passed = value >= metric.threshold
        elif metric.direction == "min":
            passed = value <= metric.threshold
        else:
            passed = value == metric.threshold
        report = FairnessReport(
            report_id=f"{metric_id}:{datetime.now(timezone.utc).isoformat()}",
            metric_id=metric_id,
            value=value,
            threshold=metric.threshold,
            passed=passed,
            details=details or {},
        )
        self._reports.append(report)
        logger.info("Fairness evaluation %s: %s", metric_id, "passed" if passed else "failed")
        return report

    def list_metrics(self) -> List[FairnessMetric]:
        return list(self._metrics.values())

    def list_reports(self, metric_id: Optional[str] = None, limit: int = 100) -> List[FairnessReport]:
        reports = self._reports
        if metric_id:
            reports = [r for r in reports if r.metric_id == metric_id]
        return reports[-limit:]


fairness_governance = FairnessGovernance()
