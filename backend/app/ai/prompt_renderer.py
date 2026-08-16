import logging
from typing import Any, Dict, Optional

from proofhire.backend.app.ai.prompt_registry import PromptRegistry, PromptTemplate

logger = logging.getLogger(__name__)


class PromptRenderer:
    def __init__(self, registry: Optional[PromptRegistry] = None):
        self.registry = registry or PromptRegistry()

    def render(self, template_name: str, variables: Dict[str, Any]) -> str:
        template = self.registry.get(template_name)
        if template is None:
            raise ValueError(f"Prompt template not found: {template_name}")
        missing = [v for v in template.input_variables if v not in variables]
        if missing:
            raise ValueError(f"Missing variables for template {template_name}: {missing}")
        try:
            return template.template.format(**variables)
        except KeyError as exc:
            raise ValueError(f"Failed to render template {template_name}: {exc}") from exc

    def render_with_metadata(self, template_name: str, variables: Dict[str, Any]) -> Dict[str, Any]:
        rendered = self.render(template_name, variables)
        template = self.registry.get(template_name)
        return {
            "template_name": template_name,
            "rendered": rendered,
            "kind": template.kind if template else None,
            "variables_used": list(variables.keys()),
        }


prompt_renderer = PromptRenderer()
