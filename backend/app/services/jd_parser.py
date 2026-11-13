from typing import Any, Dict


class JDParser:
    def parse(self, *, text: str) -> Dict[str, Any]:
        return {"title": "", "skills": [], "requirements": text}


jd_parser = JDParser()
