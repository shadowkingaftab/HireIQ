from typing import Any
from fastapi import APIRouter, Depends
from proofhire.backend.app.dependencies.auth import get_current_active_superuser
from proofhire.backend.app.models.user import User as UserModel

router = APIRouter()

@router.get("/stats")
def read_system_stats(
    current_user: UserModel = Depends(get_current_active_superuser),
) -> Any:
    return {"users": 0, "organizations": 0}
