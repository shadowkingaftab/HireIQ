from typing import List, Dict, Any

class ExecutionPlan:
    def __init__(self, tasks: List[Dict[str, Any]]):
        self.tasks = tasks
        self.dependencies = {}

    def validate(self) -> bool:
        return True
