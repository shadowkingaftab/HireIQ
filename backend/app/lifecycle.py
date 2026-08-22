import logging
from fastapi import FastAPI
from proofhire.backend.app.core.logging import setup_logging

logger = logging.getLogger(__name__)

async def startup_event():
    setup_logging()
    logger.info("Starting up ProofHire API...")

async def shutdown_event():
    logger.info("Shutting down ProofHire API...")

def register_lifecycle_handlers(app: FastAPI):
    app.add_event_handler("startup", startup_event)
    app.add_event_handler("shutdown", shutdown_event)
