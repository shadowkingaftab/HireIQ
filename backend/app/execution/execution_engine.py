import logging
from typing import Any, Dict, Optional

from proofhire.backend.app.execution.execution_context import ExecutionContext
from proofhire.backend.app.execution.execution_plan import ExecutionPlan
from proofhire.backend.app.execution.task_scheduler import TaskScheduler

logger = logging.getLogger(__name__)


class ExecutionEngine:
    def __init__(self, scheduler: Optional[TaskScheduler] = None):
        self.scheduler = scheduler or TaskScheduler()

    async def run(self, execution_id: str, plan: ExecutionPlan, payload: Optional[Dict[str, Any]] = None) -> ExecutionContext:
        context = ExecutionContext(execution_id=execution_id, plan=plan, payload=payload)
        try:
            await self.scheduler.run(plan, context)
            logger.info("Execution %s completed", execution_id)
        except Exception:
            logger.exception("Execution %s failed", execution_id)
        return context

    def get_status(self, execution_id: str) -> str:
        return "completed"


execution_engine = ExecutionEngine()
