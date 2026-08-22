from typing import Any, Dict, List


class TaskGraph:
    def __init__(self):
        self.nodes: Dict[str, Dict[str, Any]] = {}
        self.edges: List[Dict[str, Any]] = []

    def add_task(self, task_id: str, depends_on: List[str] = None) -> None:
        self.nodes[task_id] = {"depends_on": depends_on or []}

    def get_ready_tasks(self, completed_tasks: List[str]) -> List[str]:
        completed = set(completed_tasks)
        ready = []
        for task_id, node in self.nodes.items():
            if task_id in completed:
                continue
            if all(dep in completed for dep in node["depends_on"]):
                ready.append(task_id)
        return ready
