import logging
from typing import List, Optional

logger = logging.getLogger(__name__)


class SkillMapper:
    def map_to_skills(self, *, text_content: str) -> List[str]:
        if not text_content:
            return []
        try:
            from proofhire.backend.app.ai.extraction import extraction
            import asyncio
            return asyncio.run(extraction.extract_skills(text_content))
        except Exception:
            logger.exception("Skill mapping failed")
            return []


skill_mapper = SkillMapper()
