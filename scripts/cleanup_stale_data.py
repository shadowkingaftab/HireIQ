import asyncio
from datetime import datetime, timezone
from proofhire.backend.app.database import SessionLocal
from proofhire.backend.app.models.invitation import Invitation
from proofhire.backend.app.models.refresh_token import RefreshToken
from sqlalchemy import delete

async def cleanup():
    async with SessionLocal() as db:
        now = datetime.now(timezone.utc).isoformat()
        await db.execute(delete(Invitation).where(Invitation.status == "pending"))
        await db.execute(delete(RefreshToken).where(RefreshToken.revoked == True))
        await db.commit()
    print("Stale data cleanup complete")

if __name__ == "__main__":
    asyncio.run(cleanup())
