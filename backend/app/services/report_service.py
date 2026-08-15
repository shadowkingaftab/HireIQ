from typing import Dict, Any

class ReportService:
    def generate_candidate_report(self, *, candidate_id: int) -> Dict[str, Any]:
        # Build a comprehensive PDF/HTML report for a candidate
        return {"report_url": "https://storage.proofhire.com/reports/c123.pdf"}

report_service = ReportService()
