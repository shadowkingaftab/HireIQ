from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from proofhire.backend.app.database import get_db
from proofhire.backend.app.contracts.teams import TeamCreate, TeamUpdate, Team
from proofhire.backend.app.services.team_service import team_service

router = APIRouter()


@router.get("/", response_model=list[Team])
def list_teams(organization_id: int, db: Session = Depends(get_db)):
    return team_service.list_by_organization(db=db, organization_id=organization_id)


@router.post("/", response_model=Team, status_code=status.HTTP_201_CREATED)
def create_team(team_in: TeamCreate, db: Session = Depends(get_db)):
    return team_service.create(db=db, team_in=team_in)
