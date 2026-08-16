from typing import Any, Dict, Optional

class ExportService:
    def export_csv(self, *, data: List[Dict[str, Any]], filename: str) -> str:
        return filename

    def export_pdf(self, *, data: Dict[str, Any], filename: str) -> str:
        return filename


export_service = ExportService()
