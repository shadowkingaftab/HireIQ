import asyncio
from proofhire.backend.app.database import SessionLocal
from proofhire.backend.app.skill_graph.graph_builder import graph_builder
from proofhire.backend.app.models.organization import Organization
from sqlalchemy import select

async def rebuild():
    async with SessionLocal() as db:
        result = await db.execute(select(Organization))
        orgs = result.scalars().all()
        for org in orgs:
            await graph_builder.rebuild_for_organization(org.id)
            print(f"Rebuilt skill graph for org {org.id}")
        await db.commit()

if __name__ == "__main__":
    asyncio.run(rebuild())
