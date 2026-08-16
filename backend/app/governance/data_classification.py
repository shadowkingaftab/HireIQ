import logging
from enum import Enum
from typing import Dict, List

logger = logging.getLogger(__name__)


class DataClassification(str, Enum):
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    RESTRICTED = "restricted"


class DataClassificationService:
    def __init__(self):
        self._rules: Dict[str, DataClassification] = {}

    def register(self, entity_type: str, classification: DataClassification) -> None:
        self._rules[entity_type] = classification
        logger.info("Registered data classification %s for %s", classification.value, entity_type)

    def classify(self, entity_type: str) -> DataClassification:
        return self._rules.get(entity_type, DataClassification.INTERNAL)

    def list_classifications(self) -> List[Dict[str, str]]:
        return [{"entity_type": k, "classification": v.value} for k, v in self._rules.items()]


data_classification = DataClassificationService()
