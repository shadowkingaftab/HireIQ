import logging
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class PromptTemplate:
    name: str
    kind: str
    template: str
    input_variables: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


class PromptRegistry:
    def __init__(self):
        self._templates: Dict[str, PromptTemplate] = {}
        self._register_defaults()

    def _register_defaults(self) -> None:
        defaults = [
            PromptTemplate(
                name="skill_extraction",
                kind="extraction",
                template="Extract skills from the following text. Return JSON with a 'skills' array.\n\nText: {input}",
                input_variables=["input"],
            ),
            PromptTemplate(
                name="candidate_summary",
                kind="generation",
                template="Summarize this candidate profile in 3 bullet points.\n\nProfile: {profile}",
                input_variables=["profile"],
            ),
            PromptTemplate(
                name="match_explanation",
                kind="generation",
                template="Explain why this candidate matches the job. Candidate: {candidate}. Job: {job}.",
                input_variables=["candidate", "job"],
            ),
            PromptTemplate(
                name="evidence_classifier",
                kind="classification",
                template="Classify the evidence strength as high, medium, or low. Evidence: {evidence}. Return JSON with 'strength'.",
                input_variables=["evidence"],
            ),
            PromptTemplate(
                name="rerank_candidates",
                kind="reranking",
                template="Rerank these candidates for the job. Return JSON with 'ranked_ids' in order. Job: {job}. Candidates: {candidates}.",
                input_variables=["job", "candidates"],
            ),
        ]
        for template in defaults:
            self._templates[template.name] = template

    def register(self, template: PromptTemplate) -> None:
        self._templates[template.name] = template
        logger.info("Registered prompt template %s", template.name)

    def get(self, name: str) -> Optional[PromptTemplate]:
        return self._templates.get(name)

    def list_templates(self, kind: Optional[str] = None) -> List[PromptTemplate]:
        templates = list(self._templates.values())
        if kind:
            templates = [t for t in templates if t.kind == kind]
        return templates


prompt_registry = PromptRegistry()
