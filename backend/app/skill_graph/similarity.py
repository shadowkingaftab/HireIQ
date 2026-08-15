from typing import List, Dict, Any

class SimilarityCalculator:
    def calculate_skill_similarity(self, skill_a: str, skill_b: str) -> float:
        # Distance based similarity in the graph (0.0 to 1.0)
        if skill_a == skill_b:
            return 1.0
        return 0.0

similarity_calculator = SimilarityCalculator()
