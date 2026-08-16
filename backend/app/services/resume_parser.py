from typing import Any, Dict, Optional

class ResumeParser:
    async def parse(self, resume_id: str) -> Dict[str, Any]:
        return {"resume_id": resume_id, "skills": [], "experience": []}


resume_parser = ResumeParser()
