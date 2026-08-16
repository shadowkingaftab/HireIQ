import logging
import math
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class Ranker:
    def __init__(self):
        self.text_weight = 0.4
        self.vector_weight = 0.4
        self.graph_weight = 0.2
        self.recency_decay_half_life_days = 180

    def rank_candidates(
        self, candidates: List[Dict[str, Any]], query: str
    ) -> List[Dict[str, Any]]:
        if not candidates:
            return []
        query_terms = set(query.lower().split())
        for candidate in candidates:
            candidate.setdefault("score", 0.0)
            text_score = self._text_score(candidate, query_terms)
            vector_score = candidate.get("score", 0.0)
            graph_score = candidate.get("graph_score", 0.0)
            evidence_score = candidate.get("evidence_score", 0.0) or 0.0
            recency_score = self._recency_score(candidate)

            combined = (
                self.text_weight * text_score
                + self.vector_weight * vector_score
                + self.graph_weight * graph_score
                + 0.15 * evidence_score
                + 0.05 * recency_score
            )
            candidate["score"] = round(combined, 4)
            candidate["text_score"] = round(text_score, 4)
            candidate["vector_score"] = round(vector_score, 4)
            candidate["graph_score"] = round(graph_score, 4)
            candidate["evidence_score"] = round(evidence_score, 4)
            candidate["recency_score"] = round(recency_score, 4)

        candidates.sort(key=lambda c: c.get("score", 0.0), reverse=True)
        return candidates

    def rank_jobs(self, jobs: List[Dict[str, Any]], query: str) -> List[Dict[str, Any]]:
        if not jobs:
            return []
        query_terms = set(query.lower().split())
        for job in jobs:
            job.setdefault("score", 0.0)
            text_score = self._text_score(job, query_terms)
            vector_score = job.get("score", 0.0)
            recency_score = self._recency_score(job)
            combined = 0.5 * text_score + 0.4 * vector_score + 0.1 * recency_score
            job["score"] = round(combined, 4)
            job["text_score"] = round(text_score, 4)
            job["vector_score"] = round(vector_score, 4)
            job["recency_score"] = round(recency_score, 4)

        jobs.sort(key=lambda j: j.get("score", 0.0), reverse=True)
        return jobs

    def _text_score(self, item: Dict[str, Any], query_terms: set) -> float:
        if not query_terms:
            return 0.0
        text = " ".join(
            [
                item.get("name", ""),
                item.get("title", ""),
                " ".join(item.get("skills", [])),
                item.get("text", ""),
            ]
        ).lower()
        if not text:
            return 0.0
        words = set(text.split())
        matches = query_terms.intersection(words)
        if not matches:
            return 0.0
        return len(matches) / len(query_terms)

    def _recency_score(self, item: Dict[str, Any]) -> float:
        updated_at = item.get("updated_at") or item.get("last_indexed_at")
        if not updated_at:
            return 0.0
        try:
            dt = __import__("datetime").datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
            now = __import__("datetime").datetime.now(__import__("datetime").timezone.utc)
            age_days = max((now - dt).total_seconds() / 86400.0, 0.0)
            return math.exp(-math.log(2) * age_days / self.recency_decay_half_life_days)
        except Exception:
            return 0.0
