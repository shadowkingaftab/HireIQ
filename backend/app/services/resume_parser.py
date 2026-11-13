from typing import Any, Dict


class ResumeParser:
    async def parse(self, resume_id: str) -> Dict[str, Any]:
        return {"resume_id": resume_id, "skills": [], "experience": []}


resume_parser = ResumeParser()
