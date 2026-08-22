from typing import Any, Dict, List, Optional

from proofhire.backend.app.execution.task_graph import TaskGraph


class DependencyResolver:
    def __init__(self, graph: Optional[TaskGraph] = None):
        self.graph = graph or TaskGraph()

    def resolve(self, completed: List[str]) -> List[str]:
        return self.graph.get_ready_tasks(completed)

    def topological_order(self) -> List[str]:
        visited = set()
        order = []

        def visit(node):
            if node in visited:
                return
            visited.add(node)
            for dep in self.graph.nodes.get(node, {}).get("depends_on", []):
                visit(dep)
            order.append(node)

        for node in self.graph.nodes:
            visit(node)
        return order
