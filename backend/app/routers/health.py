from fastapi import APIRouter
from proofhire.backend.app.observability.health_checks import health_checks
from proofhire.backend.app.observability.readiness import readiness
from proofhire.backend.app.observability.liveness import liveness

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/ready")
async def ready():
    return await readiness.response()


@router.get("/alive")
async def alive():
    return await liveness.response()
