import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class CodeRunner:
    async def run_code(self, *, code: str, language: str, tests: List[Dict[str, Any]]) -> Dict[str, Any]:
        if language.lower() != "python":
            return {"passed": False, "results": [{"error": "Unsupported language"}]}
        results = []
        passed = 0
        for test in tests:
            ok = self._run_test(code, test)
            results.append({"test": test.get("name"), "passed": ok})
            if ok:
                passed += 1
        return {"passed": passed == len(tests), "results": results}

    def _run_test(self, code: str, test: Dict[str, Any]) -> bool:
        try:
            compiled = compile(code, "<string>", "exec")
            namespace: Dict[str, Any] = {}
            exec(compiled, namespace)
            func = namespace.get(test.get("function"))
            if func is None:
                return False
            return func(*test.get("args", [])) == test.get("expected")
        except Exception:
            return False


code_runner = CodeRunner()
