import asyncio
from faker import Faker
from proofhire.backend.app.database import SessionLocal
from proofhire.backend.app.models.assessment import Assessment
from proofhire.backend.app.assessment.question_bank import question_bank

fake = Faker()

async def main():
    async with SessionLocal() as db:
        for _ in range(20):
            assessment = Assessment(
                title=fake.sentence(),
                description=fake.text(),
                organization_id=1,
            )
            db.add(assessment)
            await db.flush()
            question_bank.add_question(str(assessment.id), {"id": fake.uuid4(), "prompt": fake.sentence(), "type": "multiple_choice"})
        await db.commit()
    print("Fixtures generated")

if __name__ == "__main__":
    asyncio.run(main())
