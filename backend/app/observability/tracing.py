import logging
from typing import Any, Dict, Optional

from proofhire.backend.app.core.config import settings

logger = logging.getLogger(__name__)


class Tracing:
    def __init__(self, service_name: str = settings.PROJECT_NAME):
        self.service_name = service_name
        self._tracer = None

    async def start(self) -> None:
        try:
            from opentelemetry import trace
            from opentelemetry.sdk.trace import TracerProvider
            from opentelemetry.sdk.trace.export import BatchSpanProcessor
            from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
            provider = TracerProvider(resource=self._resource())
            processor = BatchSpanProcessor(OTLPSpanExporter())
            provider.add_span_processor(processor)
            trace.set_tracer_provider(provider)
            self._tracer = trace.get_tracer(self.service_name)
            logger.info("Tracing initialized")
        except Exception:
            logger.exception("Failed to initialize tracing")

    def trace(self, name: str):
        if self._tracer is None:
            return _NoOpSpan()
        return self._tracer.start_as_current_span(name)

    def _resource(self) -> Any:
        try:
            from opentelemetry.sdk.resources import Resource
            return Resource.create({"service.name": self.service_name})
        except Exception:
            return None


class _NoOpSpan:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        return False

    def set_attribute(self, key: str, value: Any) -> None:
        pass

    def record_exception(self, exc: BaseException) -> None:
        pass


tracing = Tracing()
