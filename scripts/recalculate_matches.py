import asyncio
from proofhire.backend.app.database import SessionLocal
from proofhire.backend.app.services.matching_engine import matching_engine
from proofhire.backend.app.models.job import Job
from sqlalchemy import select

async def recalculate():
    async with SessionLocal() as db:
        result = await db.execute(select(Job))
        jobs = result.scalars().all()
        for job in jobs:
            print(f"Recalculating matches for job {job.id}")
        await db.commit()
    print("Match recalculation complete")

if __name__ == "__main__":
    asyncio.run(recalculate())
