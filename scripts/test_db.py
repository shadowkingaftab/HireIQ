import asyncio
from proofhire.backend.app.database import engine
from sqlalchemy import text

async def main():
    async with engine.begin() as conn:
        await conn.run_sync(lambda c: text("SELECT 1"))
    print("Database connection OK")

if __name__ == "__main__":
    asyncio.run(main())
