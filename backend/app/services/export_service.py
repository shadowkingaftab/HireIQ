from typing import List, Dict, Any

class ExportService:
    def export_data(self, *, data: List[Dict[str, Any]], format: str = "csv") -> bytes:
        # Convert data to CSV/Excel/JSON bytes
        return b"file content"

export_service = ExportService()
