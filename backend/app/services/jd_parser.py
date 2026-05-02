import re
import spacy
from typing import Dict, List
from ..utils.skill_ontology import ALL_SKILLS

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

def extract_skills_from_jd(jd_text: str) -> Dict:
    """Extract required and nice-to-have skills from a job description."""
    # Split into sections (e.g., "Requirements", "Nice to Have")
    sections = {
        "required": [],
        "nice_to_have": []
    }

    # Simple regex to find sections (customize based on JD format)
    required_section = re.search(r"requirements?[:]\s*(.*?)(?=\n\n|\n\w+[:]|$)", jd_text, re.IGNORECASE | re.DOTALL)
    nice_to_have_section = re.search(r"nice to have[:]\s*(.*?)(?=\n\n|\n\w+[:]|$)", jd_text, re.IGNORECASE | re.DOTALL)

    if required_section:
        sections["required"] = extract_skills(required_section.group(1))
    else:
        # If no specific section, try extracting from the whole text as required
        sections["required"] = extract_skills(jd_text)

    if nice_to_have_section:
        sections["nice_to_have"] = extract_skills(nice_to_have_section.group(1))

    return sections

def extract_skills(text: str) -> List[str]:
    """Extract skills from text using spaCy and skill ontology."""
    doc = nlp(text)
    found_skills = []
    text_lower = text.lower()
    
    for skill in ALL_SKILLS:
        if re.search(rf"\b{re.escape(skill.lower())}\b", text_lower):
            found_skills.append(skill)
            
    return list(set(found_skills))

def parse_jd(jd_text: str) -> Dict:
    """Parse a job description into structured data."""
    skills = extract_skills_from_jd(jd_text)
    return {
        "text": jd_text,
        "required_skills": skills["required"],
        "nice_to_have_skills": skills["nice_to_have"]
    }
