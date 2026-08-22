import asyncio
import logging
from typing import Any, Dict, List, Optional

from proofhire.backend.app.execution.execution_plan import ExecutionPlan
from proofhire.backend.app.execution.execution_context import ExecutionContext
from proofhire.backend.app.execution.task_graph import TaskGraph
from proofhire.backend.app.execution.dependency_resolver import DependencyResolver

logger = logging.getLogger(__name__)


class TaskScheduler:
    def __init__(self, max_concurrency: int = 4):
        self.max_concurrency = max_concurrency
        self._graph = TaskGraph()
        self._resolver = DependencyResolver(self._graph)

    def build_graph(self, plan: ExecutionPlan) -> None:
        self._graph = TaskGraph()
        for task in plan.tasks:
            self._graph.add_task(task["id"], task.get("depends_on", []))
        self._resolver = DependencyResolver(self._graph)

    async def run(self, plan: ExecutionPlan, context: ExecutionContext) -> Dict[str, Any]:
        self.build_graph(plan)
        completed: List[str] = []
        pending = list(self._graph.nodes.keys())
        while pending:
            ready = self._resolver.resolve(completed)
            if not ready:
                raise RuntimeError("Circular dependency detected or no ready tasks")
            batch = ready[: self.max_concurrency]
            results = await asyncio.gather(*[self._execute(task_id, context) for task_id in batch])
            for task_id, result in zip(batch, results):
                context.set_result(task_id, result)
                completed.append(task_id)
                pending.remove(task_id)
        return context.to_dict()

    async def _execute(self, task_id: str, context: ExecutionContext) -> Any:
        logger.debug("Executing task %s", task_id)
        return {"task_id": task_id, "status": "completed"}
