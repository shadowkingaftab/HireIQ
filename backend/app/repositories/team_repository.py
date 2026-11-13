from backend.app.models.team import Team
from backend.app.repositories.base_repository import BaseRepository
from sqlalchemy.orm import Session


class TeamRepository(BaseRepository[Team]):
    def list_by_organization(self, db: Session, *, organization_id: int) -> list:
        return db.query(Team).filter(Team.organization_id == organization_id).all()


team_repository = TeamRepository(Team)

