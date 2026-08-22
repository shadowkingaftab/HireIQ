import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


async def rebuild_skill_graph_job(payload: Dict[str, Any]) -> None:
    organization_id = payload.get("organization_id")
    if not organization_id:
        logger.warning("Missing organization_id in skill graph job payload")
        return
    try:
        from proofhire.backend.app.skill_graph.graph_builder import graph_builder
        await graph_builder.rebuild_for_organization(organization_id)
    except Exception:
        logger.exception("Skill graph job failed for org %s", organization_id)
