import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.app.core.logging import setup_logging

logger = logging.getLogger(__name__)


async def startup_event():
    setup_logging()
    logger.info("Starting up ProofHire API...")


async def shutdown_event():
    logger.info("Shutting down ProofHire API...")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await startup_event()
    try:
        yield
    finally:
        await shutdown_event()


def register_lifecycle_handlers(app: FastAPI):
    app.router.lifespan_context = lifespan
