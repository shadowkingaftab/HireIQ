from backend.app.models.match_result import MatchResult
from backend.app.repositories.base_repository import BaseRepository
from sqlalchemy.orm import Session


class MatchResultRepository(BaseRepository[MatchResult]):
    def list_by_job(self, db: Session, *, job_id: int) -> list:
        return db.query(MatchResult).filter(MatchResult.job_id == job_id).all()


match_result_repository = MatchResultRepository(MatchResult)

