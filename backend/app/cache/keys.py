from typing import Dict, Optional


class CacheKeys:
    @staticmethod
    def candidate(candidate_id: str) -> str:
        return f"candidate:{candidate_id}"

    @staticmethod
    def job(job_id: str) -> str:
        return f"job:{job_id}"

    @staticmethod
    def search_results(query_hash: str) -> str:
        return f"search:results:{query_hash}"

    @staticmethod
    def match(candidate_id: str, job_id: str) -> str:
        return f"match:{candidate_id}:{job_id}"

    @staticmethod
    def embedding(text_hash: str) -> str:
        return f"embedding:{text_hash}"

    @staticmethod
    def session(session_id: str) -> str:
        return f"session:{session_id}"

    @staticmethod
    def feature_flag(flag_name: str) -> str:
        return f"feature_flag:{flag_name}"

    @staticmethod
    def rate_limit(key: str) -> str:
        return f"ratelimit:{key}"
