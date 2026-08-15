from typing import Dict, Any

class Provenance:
    def record_origin(self, *, evidence_id: int, origin_details: Dict[str, Any]):
        # Track where the evidence came from and how it was processed
        pass

provenance = Provenance()
