from typing import List, Optional

from backend.app.schemas import CoreModel, TimestampModel


class TeamBase(CoreModel):
    name: str
    organization_id: int
    description: Optional[str] = None


class TeamCreate(TeamBase):
    pass


class TeamUpdate(TeamBase):
    pass


class Team(TeamBase, TimestampModel):
    id: int
    member_ids: List[int] = []

