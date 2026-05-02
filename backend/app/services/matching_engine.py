from typing import Dict, List, Any, Optional
from ..utils.nlp_utils import get_embedding, calculate_cosine_similarity, get_role_embedding
from .skill_confidence import get_all_skill_confidences
from ..utils.skill_adjacency import get_learning_time
from .weight_manager import get_skill_weights, DEFAULT_SKILL_WEIGHTS
from .ml_ranking import predict_match_quality
from ..models.recruiter_preferences import RecruiterPreference
from sqlalchemy.orm import Session
import numpy as np

def calculate_match_score(
    candidate_data: Dict, 
    jd_data: Dict, 
    github_data: Dict = None,
    db: Session = None,
    recruiter_id: str = None
) -> Dict:
    """
    Calculate a match score between a candidate and a job description.
    """
    # 0. Get Skill Weights
    skill_weights = get_skill_weights(db) if db else DEFAULT_SKILL_WEIGHTS
    
    # 0.1 Apply Recruiter Preferences (Day 67)
    custom_weights_applied = False
    if db and recruiter_id:
        prefs = db.query(RecruiterPreference).filter(
            RecruiterPreference.recruiter_id == recruiter_id
        ).first()
        if prefs and prefs.skill_weights:
            # Merge with existing weights, recruiter prefs take priority
            skill_weights = {**skill_weights, **prefs.skill_weights}
            custom_weights_applied = True

    # 1. Collect all candidate skills
    resume_skills = set(candidate_data.get("skills", []))
    github_languages = set(github_data.get("languages", {}).keys()) if github_data else set()
    
    # Combined skills for keyword matching
    candidate_skills = list(resume_skills.union(github_languages))

    # 2. JD requirements
    required_skills = set(jd_data.get("required_skills", []))
    nice_to_have_skills = set(jd_data.get("nice_to_have_skills", []))

    # 3. Keyword Matching
    candidate_skills_set = set(candidate_skills)
    matched_required = candidate_skills_set.intersection(required_skills)
    matched_nice_to_have = candidate_skills_set.intersection(nice_to_have_skills)
    missing_required = required_skills - candidate_skills_set
    missing_nice_to_have = nice_to_have_skills - candidate_skills_set

    # 4. Keyword Score (weighted by skill importance)
    keyword_score = 0
    if required_skills:
        weighted_matched = sum(skill_weights.get(skill, 1.0) for skill in matched_required)
        total_required_weight = sum(skill_weights.get(skill, 1.0) for skill in required_skills)
        if total_required_weight > 0:
            keyword_score += (weighted_matched / total_required_weight) * 70
            
    if nice_to_have_skills:
        weighted_matched_nice = sum(skill_weights.get(skill, 1.0) for skill in matched_nice_to_have)
        total_nice_weight = sum(skill_weights.get(skill, 1.0) for skill in nice_to_have_skills)
        if total_nice_weight > 0:
            keyword_score += (weighted_matched_nice / total_nice_weight) * 30

    # 5. Semantic Similarity
    candidate_text = " ".join(candidate_skills)
    jd_text = " ".join(list(required_skills))
    
    semantic_score = 0
    if candidate_text.strip() and jd_text.strip():
        candidate_embedding = get_embedding(candidate_text)
        jd_embedding = get_embedding(jd_text)
        semantic_score = calculate_cosine_similarity(candidate_embedding, jd_embedding) * 100

    # 5.1 Role-based Seniority Matching
    role_score = 0
    candidate_role = candidate_data.get("role")
    jd_role = jd_data.get("role")
    if candidate_role and jd_role:
        cand_role_emb = get_role_embedding(candidate_role)
        jd_role_emb = get_role_embedding(jd_role)
        role_score = calculate_cosine_similarity(cand_role_emb, jd_role_emb) * 100

    # 6. Final Fit Score: Weighted average
    # 50% keyword, 30% semantic, 20% role seniority
    if required_skills or nice_to_have_skills:
        if role_score > 0:
            fit_score = (keyword_score * 0.5) + (semantic_score * 0.3) + (role_score * 0.2)
        else:
            fit_score = (keyword_score + semantic_score) / 2
    else:
        fit_score = semantic_score

    # 7. Skill Confidence (Day 17)
    skill_confidence = get_all_skill_confidences(candidate_skills, candidate_data, github_data)

    # 8. Trainability Scores (Day 24)
    trainability = {}
    for skill in missing_required:
        trainability[skill] = get_learning_time(
            candidate_data.get("skills", []),
            skill
        )

    result = {
        "fit_score": round(fit_score, 1),
        "semantic_similarity": round(semantic_score, 1),
        "matched_skills": {
            "required": list(matched_required),
            "nice_to_have": list(matched_nice_to_have)
        },
        "missing_skills": {
            "required": list(missing_required),
            "nice_to_have": list(missing_nice_to_have)
        },
        "skill_confidence": skill_confidence,
        "trainability": trainability,
        "skill_weights": {k: round(v, 2) for k, v in skill_weights.items()},
        "custom_weights_applied": custom_weights_applied
    }

    # 9. ML Ranking Prediction (Day 66)
    ml_hire_probability = predict_match_quality(result)
    result["ml_hire_probability"] = round(ml_hire_probability * 100, 1)

    return result
