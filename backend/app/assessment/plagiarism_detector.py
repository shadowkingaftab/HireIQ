import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class PlagiarismDetector:
    def compare(self, *, source_a: str, source_b: str) -> float:
        from difflib import SequenceMatcher
        return SequenceMatcher(None, source_a, source_b).ratio()

    def detect(self, *, submissions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        flags = []
        for i in range(len(submissions)):
            for j in range(i + 1, len(submissions)):
                score = self.compare(source_a=submissions[i].get("answer", ""), source_b=submissions[j].get("answer", ""))
                if score > 0.8:
                    flags.append({"submission_a": submissions[i].get("id"), "submission_b": submissions[j].get("id"), "score": score})
        return flags


plagiarism_detector = PlagiarismDetector()
