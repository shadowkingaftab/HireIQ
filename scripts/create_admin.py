import asyncio
from proofhire.backend.app.database import SessionLocal
from proofhire.backend.app.models.user import User
from proofhire.backend.app.models.role import Role, user_roles
from proofhire.backend.app.core.security import get_password_hash
from sqlalchemy import insert

async def main():
    async with SessionLocal() as db:
        admin = User(
            email="admin@proofhire.io",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            is_active=True,
            is_superuser=True,
        )
        db.add(admin)
        await db.flush()
        role = Role(name="admin", description="Administrator")
        db.add(role)
        await db.flush()
        await db.execute(insert(user_roles).values(user_id=admin.id, role_id=role.id))
        await db.commit()
    print("Admin created: admin@proofhire.io / admin123")

if __name__ == "__main__":
    asyncio.run(main())
