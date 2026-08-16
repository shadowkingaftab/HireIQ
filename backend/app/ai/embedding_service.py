import logging
from typing import List, Optional

from proofhire.backend.app.ai.model_registry import ModelRegistry, ModelInfo

logger = logging.getLogger(__name__)


class EmbeddingService:
    def __init__(self, registry: Optional[ModelRegistry] = None):
        self.registry = registry or ModelRegistry()
        self._cache: Dict[str, List[float]] = {}

    async def embed_text(self, text: str, model_name: Optional[str] = None) -> Optional[List[float]]:
        if not text.strip():
            return None
        cache_key = f"{model_name}:{text}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        model = self.registry.resolve(kind="embedding", preferred=model_name)
        if model is None:
            logger.warning("No embedding model available")
            return None

        try:
            vector = await self._call_provider(model, text)
            self._cache[cache_key] = vector
            return vector
        except Exception:
            logger.exception("Embedding failed for model %s", model.name)
            return None

    async def embed_batch(self, texts: List[str], model_name: Optional[str] = None) -> List[Optional[List[float]]]:
        return [await self.embed_text(text, model_name=model_name) for text in texts]

    async def _call_provider(self, model: ModelInfo, text: str) -> List[float]:
        provider = model.provider.lower()
        if provider == "openai":
            return await self._openai_embed(model, text)
        raise ValueError(f"Unsupported embedding provider: {provider}")

    async def _openai_embed(self, model: ModelInfo, text: str) -> List[float]:
        try:
            import openai
        except ImportError:
            raise RuntimeError("openai package is required for OpenAI embeddings")
        client = openai.AsyncOpenAI()
        response = await client.embeddings.create(input=text, model=model.model_id, dimensions=model.dimensions)
        return response.data[0].embedding

    def clear_cache(self) -> None:
        self._cache.clear()


embedding_service = EmbeddingService()
