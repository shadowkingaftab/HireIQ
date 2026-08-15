from typing import List, Dict, Any

class TaskGraph:
    def __init__(self):
        self.nodes = {}
        self.edges = []

    def add_task(self, task_id: str, depends_on: List[str] = None):
        self.nodes[task_id] = depends_on or []

    def get_ready_tasks(self, completed_tasks: List[str]) -> List[str]:
        return []
