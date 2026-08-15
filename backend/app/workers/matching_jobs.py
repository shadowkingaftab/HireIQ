from typing import Dict, Any

async def run_matching_job(payload: Dict[str, Any]):
    job_id = payload.get("job_id")
    # matching_engine.rank_candidates(...)
    pass
