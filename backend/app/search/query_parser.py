import re
import uuid
from typing import Any, Dict, List, Optional

from proofhire.backend.app.core.feature_flags import feature_flags


class ParsedQuery:
    def __init__(
        self,
        text: str,
        filters: Dict[str, Any],
        vector: Optional[List[float]] = None,
        boosts: Optional[Dict[str, float]] = None,
    ):
        self.text = text
        self.filters = filters
        self.vector = vector
        self.boosts = boosts or {}


class QueryParser:
    def parse(self, query_str: str) -> ParsedQuery:
        text = query_str.strip()
        filters: Dict[str, Any] = {}
        boosts: Dict[str, float] = {}
        vector = None

        skill_matches = re.findall(r"skill:([^,\s]+)", text, flags=re.IGNORECASE)
        if skill_matches:
            filters["skills"] = [s.lower() for s in skill_matches]

        location_match = re.search(r"location:([^,\s]+)", text, flags=re.IGNORECASE)
        if location_match:
            filters["location"] = location_match.group(1)

        experience_match = re.search(r"experience:(\d+)", text, flags=re.IGNORECASE)
        if experience_match:
            filters["min_experience_years"] = int(experience_match.group(1))

        level_match = re.search(r"level:([^,\s]+)", text, flags=re.IGNORECASE)
        if level_match:
            filters["level"] = level_match.group(1).lower()

        available_match = re.search(r"available:(true|false|yes|no)", text, flags=re.IGNORECASE)
        if available_match:
            value = available_match.group(1).lower()
            filters["available"] = value in ("true", "yes")

        text = re.sub(r"skill:[^,\s]+", "", text, flags=re.IGNORECASE)
        text = re.sub(r"location:[^,\s]+", "", text, flags=re.IGNORECASE)
        text = re.sub(r"experience:\d+", "", text, flags=re.IGNORECASE)
        text = re.sub(r"level:[^,\s]+", "", text, flags=re.IGNORECASE)
        text = re.sub(r"available:(true|false|yes|no)", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\s+", " ", text).strip()

        if feature_flags.is_enabled("SEMANTIC_SEARCH_ENABLED"):
            vector = [0.0] * 384

        return ParsedQuery(text=text, filters=filters, vector=vector, boosts=boosts)


query_parser = QueryParser()
