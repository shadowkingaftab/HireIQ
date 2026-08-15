from typing import Any
from fastapi import APIRouter, Request

router = APIRouter()

@router.post("/{provider}")
async def handle_webhook(
    provider: str,
    request: Request,
) -> Any:
    payload = await request.json()
    # Logic to process webhook based on provider
    return {"status": "received"}
