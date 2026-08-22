import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class ContradictionDetector:
    def detect(self, *, evidence_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        contradictions: List[Dict[str, Any]] = []
        skills_by_source: Dict[str, List[str]] = {}
        for item in evidence_list:
            source = item.get("source", "unknown")
            skills = item.get("content", {}).get("skills", [])
            skills_by_source.setdefault(source, []).extend(skills)
        sources = list(skills_by_source.keys())
        for i in range(len(sources)):
            for j in range(i + 1, len(sources)):
                a = set(skills_by_source[sources[i]])
                b = set(skills_by_source[sources[j]])
                conflict = a.symmetric_difference(b)
                if conflict:
                    contradictions.append({"sources": [sources[i], sources[j]], "conflicting_skills": list(conflict)})
        logger.debug("Detected %s contradictions", len(contradictions))
        return contradictions


contradiction_detector = ContradictionDetector()
