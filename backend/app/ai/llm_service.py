import logging
from typing import Any, Dict, List, Optional, Union

from proofhire.backend.app.ai.model_registry import ModelRegistry, ModelInfo

logger = logging.getLogger(__name__)


class LLMService:
    def __init__(self, registry: Optional[ModelRegistry] = None):
        self.registry = registry or ModelRegistry()

    async def complete(
        self,
        prompt: str,
        model_name: Optional[str] = None,
        temperature: float = 0.0,
        max_tokens: int = 1024,
        response_format: Optional[Dict[str, Any]] = None,
    ) -> Optional[str]:
        model = self.registry.resolve(kind="llm", preferred=model_name)
        if model is None:
            logger.warning("No LLM model available")
            return None
        try:
            return await self._call_provider(model, prompt, temperature, max_tokens, response_format)
        except Exception:
            logger.exception("LLM completion failed for model %s", model.name)
            return None

    async def complete_json(
        self,
        prompt: str,
        model_name: Optional[str] = None,
        temperature: float = 0.0,
        max_tokens: int = 1024,
    ) -> Optional[Dict[str, Any]]:
        import json
        response_format = {"type": "json_object"}
        raw = await self.complete(prompt, model_name=model_name, temperature=temperature, max_tokens=max_tokens, response_format=response_format)
        if not raw:
            return None
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            logger.exception("Failed to parse LLM JSON response")
            return None

    async def _call_provider(
        self, model: ModelInfo, prompt: str, temperature: float, max_tokens: int, response_format: Optional[Dict[str, Any]]
    ) -> str:
        provider = model.provider.lower()
        if provider == "openai":
            return await self._openai_chat(model, prompt, temperature, max_tokens, response_format)
        if provider == "anthropic":
            return await self._anthropic_chat(model, prompt, temperature, max_tokens)
        raise ValueError(f"Unsupported LLM provider: {provider}")

    async def _openai_chat(
        self, model: ModelInfo, prompt: str, temperature: float, max_tokens: int, response_format: Optional[Dict[str, Any]]
    ) -> str:
        try:
            import openai
        except ImportError:
            raise RuntimeError("openai package is required for OpenAI LLM")
        client = openai.AsyncOpenAI()
        kwargs: Dict[str, Any] = {"model": model.model_id, "messages": [{"role": "user", "content": prompt}], "temperature": temperature, "max_tokens": max_tokens}
        if response_format:
            kwargs["response_format"] = response_format
        response = await client.chat.completions.create(**kwargs)
        return response.choices[0].message.content or ""

    async def _anthropic_chat(
        self, model: ModelInfo, prompt: str, temperature: float, max_tokens: int
    ) -> str:
        try:
            import anthropic
        except ImportError:
            raise RuntimeError("anthropic package is required for Anthropic LLM")
        client = anthropic.AsyncAnthropic()
        response = await client.messages.create(
            model=model.model_id,
            max_tokens=max_tokens,
            temperature=temperature,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.content[0].text if response.content else ""


llm_service = LLMService()
