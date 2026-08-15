from typing import Dict, Any
from proofhire.backend.app.services.resume_parser import resume_parser

async def process_resume_job(payload: Dict[str, Any]):
    resume_id = payload.get("resume_id")
    # Fetch resume bytes and parse
    # resume_parser.parse(...)
    pass
