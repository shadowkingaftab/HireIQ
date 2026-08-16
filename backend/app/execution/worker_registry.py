from typing import Any, Dict, Optional

from proofhire.backend.app.execution.execution_plan import ExecutionPlan


class WorkerRegistry:
    def __init__(self):
        self._workers: Dict[str, Any] = {}

    def register(self, name: str, worker: Any) -> None:
        self._workers[name] = worker

    def get(self, name: str) -> Optional[Any]:
        return self._workers.get(name)

    def list_workers(self) -> List[str]:
        return list(self._workers.keys())


worker_registry = WorkerRegistry()
