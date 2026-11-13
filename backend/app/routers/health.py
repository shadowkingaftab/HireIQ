from backend.app.observability.liveness import liveness
from backend.app.observability.readiness import readiness
from fastapi import APIRouter

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

