import asyncio
from proofhire.backend.app.database import SessionLocal
from proofhire.backend.app.search.indexer import indexer
from proofhire.backend.app.models.job import Job
from proofhire.backend.app.models.candidate import Candidate
from sqlalchemy import select

async def rebuild():
    async with SessionLocal() as db:
        result = await db.execute(select(Job))
        jobs = result.scalars().all()
        for job in jobs:
            await indexer.index_job(job)
        result = await db.execute(select(Candidate))
        candidates = result.scalars().all()
        for candidate in candidates:
            await indexer.index_candidate(candidate)
        await db.commit()
    print("Search index rebuilt")

if __name__ == "__main__":
    asyncio.run(rebuild())
