import logging
from enum import Enum
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class ExecutionEventType(str, Enum):
    STARTED = "execution.started"
    TASK_STARTED = "execution.task.started"
    TASK_COMPLETED = "execution.task.completed"
    TASK_FAILED = "execution.task.failed"
    COMPLETED = "execution.completed"
    FAILED = "execution.failed"


class ExecutionEvents:
    @staticmethod
    def started(execution_id: str, intent: str) -> Dict[str, Any]:
        return {"event": ExecutionEventType.STARTED.value, "execution_id": execution_id, "intent": intent}

    @staticmethod
    def task_completed(execution_id: str, task_id: str) -> Dict[str, Any]:
        return {"event": ExecutionEventType.TASK_COMPLETED.value, "execution_id": execution_id, "task_id": task_id}

    @staticmethod
    def task_failed(execution_id: str, task_id: str, error: str) -> Dict[str, Any]:
        return {"event": ExecutionEventType.TASK_FAILED.value, "execution_id": execution_id, "task_id": task_id, "error": error}

    @staticmethod
    def completed(execution_id: str) -> Dict[str, Any]:
        return {"event": ExecutionEventType.COMPLETED.value, "execution_id": execution_id}

    @staticmethod
    def failed(execution_id: str, error: str) -> Dict[str, Any]:
        return {"event": ExecutionEventType.FAILED.value, "execution_id": execution_id, "error": error}
