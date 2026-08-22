import logging
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


@dataclass
class IndexStats:
    total_documents: int = 0
    last_indexed_at: Optional[str] = None
    pending_count: int = 0


class SearchIndexer:
    def __init__(self, vector_store: Any, graph_db: Any):
        self.vector_store = vector_store
        self.graph_db = graph_db
        self._stats = IndexStats()

    async def index_candidate(self, candidate_id: str, payload: Dict[str, Any]) -> None:
        try:
            text_parts = [
                payload.get("name", ""),
                " ".join(payload.get("skills", [])),
                " ".join(payload.get("summary", "").split()),
                " ".join(payload.get("experience", [])),
            ]
            text = " ".join(part for part in text_parts if part)

            vector = payload.get("embedding")
            if vector is None:
                logger.warning("No embedding provided for candidate %s", candidate_id)
                return

            await self.vector_store.upsert(
                collection="candidates",
                id=candidate_id,
                vector=vector,
                payload={
                    "candidate_id": candidate_id,
                    "text": text,
                    "skills": payload.get("skills", []),
                    "experience_years": payload.get("experience_years", 0),
                    "organization_id": payload.get("organization_id"),
                },
            )

            if self.graph_db:
                await self.graph_db.upsert_node(
                    label="Candidate",
                    node_id=candidate_id,
                    properties={
                        "name": payload.get("name"),
                        "organization_id": payload.get("organization_id"),
                    },
                )

            self._stats.total_documents += 1
            self._stats.last_indexed_at = __import__("datetime").datetime.utcnow().isoformat()
            logger.info("Indexed candidate %s", candidate_id)
        except Exception:
            logger.exception("Failed to index candidate %s", candidate_id)
            raise

    async def index_job(self, job_id: str, payload: Dict[str, Any]) -> None:
        try:
            text_parts = [
                payload.get("title", ""),
                payload.get("description", ""),
                " ".join(payload.get("skills", [])),
                " ".join(payload.get("requirements", "").split()),
            ]
            text = " ".join(part for part in text_parts if part)

            vector = payload.get("embedding")
            if vector is None:
                logger.warning("No embedding provided for job %s", job_id)
                return

            await self.vector_store.upsert(
                collection="jobs",
                id=job_id,
                vector=vector,
                payload={
                    "job_id": job_id,
                    "text": text,
                    "skills": payload.get("skills", []),
                    "status": payload.get("status", "open"),
                    "organization_id": payload.get("organization_id"),
                },
            )

            if self.graph_db:
                await self.graph_db.upsert_node(
                    label="Job",
                    node_id=job_id,
                    properties={
                        "title": payload.get("title"),
                        "status": payload.get("status", "open"),
                        "organization_id": payload.get("organization_id"),
                    },
                )

            self._stats.total_documents += 1
            self._stats.last_indexed_at = __import__("datetime").datetime.utcnow().isoformat()
            logger.info("Indexed job %s", job_id)
        except Exception:
            logger.exception("Failed to index job %s", job_id)
            raise

    async def delete_candidate(self, candidate_id: str) -> None:
        await self.vector_store.delete(collection="candidates", id=candidate_id)
        if self.graph_db:
            await self.graph_db.delete_node(label="Candidate", node_id=candidate_id)
        self._stats.total_documents = max(0, self._stats.total_documents - 1)
        logger.info("Deleted candidate index %s", candidate_id)

    async def delete_job(self, job_id: str) -> None:
        await self.vector_store.delete(collection="jobs", id=job_id)
        if self.graph_db:
            await self.graph_db.delete_node(label="Job", node_id=job_id)
        self._stats.total_documents = max(0, self._stats.total_documents - 1)
        logger.info("Deleted job index %s", job_id)

    def get_stats(self) -> IndexStats:
        return self._stats
