import asyncio
from proofhire.backend.app.database import SessionLocal
from proofhire.backend.app.models.match_result import MatchResult
from proofhire.backend.app.matching.pipeline import MatchingPipeline
from sqlalchemy import select

async def recompute():
    async with SessionLocal() as db:
        result = await db.execute(select(MatchResult))
        matches = result.scalars().all()
        pipeline = MatchingPipeline()
        for match in matches:
            print(f"Recomputing match {match.id}")
        await db.commit()
    print("Score recomputation complete")

if __name__ == "__main__":
    asyncio.run(recompute())
