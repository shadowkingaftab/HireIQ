import asyncio
from proofhire.backend.app.database import SessionLocal
from proofhire.backend.app.models.evidence import Evidence
from proofhire.backend.app.models.candidate import Candidate
from sqlalchemy import select

async def migrate_evidence():
    async with SessionLocal() as db:
        result = await db.execute(select(Evidence).where(Evidence.verified == True))
        evidence_items = result.scalars().all()
        for evidence in evidence_items:
            candidate = await db.get(Candidate, evidence.candidate_id)
            if candidate:
                print(f"Migrated evidence {evidence.id} for candidate {candidate.id}")
        await db.commit()

if __name__ == "__main__":
    asyncio.run(migrate_evidence())
