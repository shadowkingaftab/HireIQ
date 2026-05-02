import pytest
from unittest.mock import patch, MagicMock
from app.services.resume_parser import extract_text_from_pdf, extract_skills
from app.utils.skill_ontology import ALL_SKILLS

class MockPage:
    def __init__(self, text, tables=None):
        self.text = text
        self.tables = tables or []
        
    def extract_text(self):
        return self.text
        
    def extract_tables(self):
        return self.tables

class MockPDF:
    def __init__(self, pages):
        self.pages = pages
        
    def __enter__(self):
        return self
        
    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

def test_extract_text_from_pdf_success():
    with patch('pdfplumber.open') as mock_open:
        mock_open.return_value = MockPDF([
            MockPage("John Doe\nSoftware Engineer"),
            MockPage("Experience\nGoogle 2020-2023")
        ])
        
        text = extract_text_from_pdf("dummy.pdf")
        assert "John Doe" in text
        assert "Software Engineer" in text
        assert "Google 2020-2023" in text

def test_extract_text_from_pdf_empty():
    with patch('pdfplumber.open') as mock_open:
        mock_open.return_value = MockPDF([
            MockPage(None)
        ])
        
        with pytest.raises(ValueError) as excinfo:
            extract_text_from_pdf("dummy.pdf")
        assert "No extractable text found" in str(excinfo.value)

def test_extract_skills():
    # Make sure we have some skills in ALL_SKILLS
    if not ALL_SKILLS:
        ALL_SKILLS.extend(["Python", "JavaScript", "React"])
        
    text = "I am a proficient Python developer with experience in React and JavaScript."
    skills = extract_skills(text)
    
    assert "Python" in skills
    assert "React" in skills
    assert "JavaScript" in skills
