import sys
import os

# Add the project root to sys.path so we can import backend.app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.database import engine
from backend.app.models.base import Base
from backend.app.models.candidate import Candidate
from backend.app.models.skill import Skill
from backend.app.models.job import Job
from backend.app.models.assessment import Assessment, CandidateAssessment
from backend.app.models.endorsement import Endorsement
from backend.app.models.skill_graph import SkillGraph

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")
except Exception as e:
    print(f"❌ Error creating tables: {e}")
    print("Note: Make sure PostgreSQL is running and the 'proofhire' database exists.")
