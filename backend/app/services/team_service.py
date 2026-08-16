from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.contracts.teams import TeamCreate, TeamUpdate
from proofhire.backend.app.models.team import Team

class TeamService:
    def list_by_organization(self, db: Session, *, organization_id: int) -> List[Team]:
        return db.query(Team).filter(Team.organization_id == organization_id).all()

    def create(self, db: Session, *, team_in: TeamCreate) -> Team:
        db_obj = Team(**team_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, *, db_obj: Team, obj_in: TeamUpdate) -> Team:
        for field, value in obj_in.dict(exclude_unset=True).items():
            setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj


team_service = TeamService()
