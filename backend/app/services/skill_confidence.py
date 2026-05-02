from typing import Dict, List, Any

def calculate_skill_confidence(skill_name: str, candidate_data: Dict, github_data: Dict = None) -> float:
    """
    Calculate a confidence score (0.0 to 1.0) for a specific skill.
    Factors:
    - Mentioned in resume (base confidence: 0.5)
    - Appears in GitHub languages (bonus: 0.3)
    - High commit activity/stars (bonus: up to 0.2)
    """
    confidence = 0.0
    
    # 1. Resume check
    resume_skills = [s.lower() for s in candidate_data.get("skills", [])]
    if skill_name.lower() in resume_skills:
        confidence += 0.5
        
    # 2. GitHub check
    if github_data:
        github_languages = github_data.get("languages", {})
        # GitHub language keys are usually title-cased or exactly as GitHub returns them
        github_languages_lower = {k.lower(): v for k, v in github_languages.items()}
        
        if skill_name.lower() in github_languages_lower:
            confidence += 0.3
            
            # 3. GitHub Activity bonus
            # If the language accounts for a significant portion of their code
            total_bytes = sum(github_languages.values())
            if total_bytes > 0:
                skill_bytes = github_languages_lower[skill_name.lower()]
                percentage = skill_bytes / total_bytes
                
                if percentage > 0.5:
                    confidence += 0.2
                elif percentage > 0.2:
                    confidence += 0.1
                    
            # Star bonus (if they have stars on repos using this language)
            total_stars = github_data.get("total_stars", 0)
            if total_stars > 50:
                confidence += 0.1
    
    return min(round(confidence, 2), 1.0)

def get_all_skill_confidences(candidate_skills: List[str], candidate_data: Dict, github_data: Dict = None) -> Dict[str, float]:
    """Calculate confidence scores for a list of skills."""
    confidences = {}
    for skill in candidate_skills:
        confidences[skill] = calculate_skill_confidence(skill, candidate_data, github_data)
    return confidences
