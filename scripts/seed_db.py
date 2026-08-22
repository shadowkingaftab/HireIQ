import asyncio
from faker import Faker
from proofhire.backend.app.database import SessionLocal
from proofhire.backend.app.models.user import User
from proofhire.backend.app.models.candidate import Candidate
from proofhire.backend.app.models.job import Job
from proofhire.backend.app.core.security import get_password_hash

fake = Faker()

async def main():
    async with SessionLocal() as db:
        for _ in range(10):
            user = User(
                email=fake.unique.email(),
                hashed_password=get_password_hash("password"),
                full_name=fake.name(),
                is_active=True,
            )
            db.add(user)
            db.flush()
            candidate = Candidate(user_id=user.id, skills=["python", "fastapi"])
            db.add(candidate)
        for _ in range(5):
            job = Job(
                title=fake.job(),
                description=fake.text(),
                organization_id=1,
                recruiter_id=1,
            )
            db.add(job)
        await db.commit()
    print("Seed complete")

if __name__ == "__main__":
    asyncio.run(main())
