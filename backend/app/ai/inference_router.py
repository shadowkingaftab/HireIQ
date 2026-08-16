import logging
from enum import Enum
from typing import Any, Dict, Optional

from proofhire.backend.app.ai.model_registry import ModelInfo
from proofhire.backend.app.ai.llm_service import LLMService

logger = logging.getLogger(__name__)


class TaskKind(str, Enum):
    EMBEDDING = "embedding"
    GENERATION = "generation"
    EXTRACTION = "extraction"
    CLASSIFICATION = "classification"
    RERANKING = "reranking"
    EVALUATION = "evaluation"


class InferenceRouter:
    def __init__(self, llm_service: Optional[LLMService] = None, registry: Optional[Any] = None):
        self.llm_service = llm_service or LLMService()
        self.registry = registry
        self._handlers = {
            TaskKind.EMBEDDING: self._handle_embedding,
            TaskKind.GENERATION: self._handle_generation,
            TaskKind.EXTRACTION: self._handle_extraction,
            TaskKind.CLASSIFICATION: self._handle_classification,
            TaskKind.RERANKING: self._handle_reranking,
            TaskKind.EVALUATION: self._handle_evaluation,
        }

    async def route(self, task: TaskKind, payload: Dict[str, Any], model_override: Optional[str] = None) -> Any:
        handler = self._handlers.get(task)
        if handler is None:
            raise ValueError(f"No handler for task kind: {task}")
        return await handler(payload, model_override)

    async def _handle_embedding(self, payload: Dict[str, Any], model_override: Optional[str]) -> Any:
        from proofhire.backend.app.ai.embedding_service import EmbeddingService
        service = EmbeddingService(registry=self.registry)
        return await service.embed_text(payload.get("text", ""), model_name=model_override)

    async def _handle_generation(self, payload: Dict[str, Any], model_override: Optional[str]) -> Any:
        return await self.llm_service.complete(
            prompt=payload.get("prompt", ""),
            model_name=model_override or payload.get("model"),
            temperature=payload.get("temperature", 0.0),
            max_tokens=payload.get("max_tokens", 1024),
        )

    async def _handle_extraction(self, payload: Dict[str, Any], model_override: Optional[str]) -> Any:
        return await self.llm_service.complete_json(
            prompt=payload.get("prompt", ""),
            model_name=model_override or payload.get("model"),
            temperature=payload.get("temperature", 0.0),
            max_tokens=payload.get("max_tokens", 1024),
        )

    async def _handle_classification(self, payload: Dict[str, Any], model_override: Optional[str]) -> Any:
        return await self.llm_service.complete_json(
            prompt=payload.get("prompt", ""),
            model_name=model_override or payload.get("model"),
            temperature=0.0,
            max_tokens=256,
        )

    async def _handle_reranking(self, payload: Dict[str, Any], model_override: Optional[str]) -> Any:
        return await self.llm_service.complete_json(
            prompt=payload.get("prompt", ""),
            model_name=model_override or payload.get("model"),
            temperature=0.0,
            max_tokens=1024,
        )

    async def _handle_evaluation(self, payload: Dict[str, Any], model_override: Optional[str]) -> Any:
        return await self.llm_service.complete_json(
            prompt=payload.get("prompt", ""),
            model_name=model_override or payload.get("model"),
            temperature=0.0,
            max_tokens=1024,
        )


inference_router = InferenceRouter()
