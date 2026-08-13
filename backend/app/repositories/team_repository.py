from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.team import Team
from proofhire.backend.app.contracts.teams import TeamCreate, CoreModel # Using CoreModel as update placeholder

class TeamRepository(BaseRepository[Team, TeamCreate, Any]):
    def get_by_organization(self, db: Session, *, organization_id: int) -> List[Team]:
        return db.query(Team).filter(Team.organization_id == organization_id).all()

team_repository = TeamRepository(Team)
