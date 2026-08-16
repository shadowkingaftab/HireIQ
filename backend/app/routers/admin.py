from fastapi import APIRouter, Depends
from proofhire.backend.app.contracts.admin import AdminAction, SystemStats
from proofhire.backend.app.services.audit_service import audit_service

router = APIRouter()


@router.post("/actions")
def admin_action(action: AdminAction):
    audit_service.record_action(actor_id=action.actor_id, action_type=action.action_type, resource_id=action.resource_id, details=action.details)
    return {"status": "recorded"}


@router.get("/stats", response_model=SystemStats)
def system_stats():
    return SystemStats(user_count=0, org_count=0, job_count=0, active_connections=0)
