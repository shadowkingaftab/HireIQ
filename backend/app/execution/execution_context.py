import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class ExecutionContext:
    def __init__(self, execution_id: str, plan: Any, payload: Optional[Dict[str, Any]] = None):
        self.execution_id = execution_id
        self.plan = plan
        self.payload = payload or {}
        self._results: Dict[str, Any] = {}
        self._state: Dict[str, Any] = {}

    def set_result(self, task_id: str, result: Any) -> None:
        self._results[task_id] = result

    def get_result(self, task_id: str) -> Any:
        return self._results.get(task_id)

    def set_state(self, key: str, value: Any) -> None:
        self._state[key] = value

    def get_state(self, key: str, default: Any = None) -> Any:
        return self._state.get(key, default)

    def to_dict(self) -> Dict[str, Any]:
        return {"execution_id": self.execution_id, "results": self._results, "state": self._state}
