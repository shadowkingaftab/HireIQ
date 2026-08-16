from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.services.skill_graph_service import skill_graph_service
from proofhire.backend.app.contracts.skill_graph import SkillGraphQuery

router = APIRouter()


@router.get("/")
def list_skills(db: Session = Depends(get_db)):
    return skill_graph_service.list_skills(db=db)


@router.post("/query")
def query_skills(query: SkillGraphQuery):
    return skill_graph_service.query(skill_names=query.skill_names, depth=query.depth)
