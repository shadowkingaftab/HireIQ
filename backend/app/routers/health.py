from fastapi import APIRouter
from proofhire.backend.app.contracts.common import MessageResponse

router = APIRouter()

@router.get("", response_model=MessageResponse)
async def health_check():
    return {"message": "healthy"}
