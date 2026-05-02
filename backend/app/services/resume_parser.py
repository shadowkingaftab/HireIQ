import pdfplumber
import re
import spacy
from typing import Dict, List, Any
from ..utils.skill_ontology import ALL_SKILLS

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(pdf_file) -> str:
    """Extract text from a PDF file."""
    text = ""
    try:
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                
                # Also extract from tables as fallback
                tables = page.extract_tables()
                for table in tables:
                    for row in table:
                        row_text = " ".join([str(cell) for cell in row if cell])
                        text += row_text + "\n"
                        
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        raise ValueError(f"Failed to read PDF file: {str(e)}")
        
    if not text.strip():
        raise ValueError("No extractable text found in the PDF. It might be an image-based PDF.")
        
    return text

def extract_skills(text: str) -> List[str]:
    """Extract skills from text using spaCy and skill ontology."""
    doc = nlp(text)
    found_skills = []
    
    # Simple keyword matching on tokens/phrases for now, but using spaCy's tokenization
    # This handles multi-word skills better than simple split()
    text_lower = text.lower()
    
    for skill in ALL_SKILLS:
        # Use regex with word boundaries for better accuracy
        # but the list comes from our ontology
        if re.search(rf"\b{re.escape(skill.lower())}\b", text_lower):
            found_skills.append(skill)
            
    return list(set(found_skills))

def extract_experience(text: str) -> List[Dict]:
    """Extract experience from text."""
    # Placeholder: Keeping the same logic for now as per Week 3 plan
    return [
        {"company": "Example Corp", "role": "Software Engineer", "duration": "2020-2023"},
        {"company": "Startup Inc", "role": "Backend Developer", "duration": "2018-2020"}
    ]

def parse_resume(pdf_file) -> Dict:
    """Parse a PDF resume into structured data."""
    text = extract_text_from_pdf(pdf_file)
    skills = extract_skills(text)
    experience = extract_experience(text)
    return {
        "text": text,
        "skills": skills,
        "experience": experience
    }
