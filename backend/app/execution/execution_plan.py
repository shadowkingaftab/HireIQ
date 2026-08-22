from dataclasses import dataclass, field
from typing import Any, Dict, List


@dataclass
class ExecutionPlan:
    intent: str
    tasks: List[Dict[str, Any]] = field(default_factory=list)
    dependencies: Dict[str, List[str]] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def validate(self) -> bool:
        if not self.intent:
            return False
        task_ids = {task["id"] for task in self.tasks}
        for task_id, deps in self.dependencies.items():
            if task_id not in task_ids:
                return False
            for dep in deps:
                if dep not in task_ids:
                    return False
        return True
