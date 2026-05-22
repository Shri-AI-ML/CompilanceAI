from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.user import User


class UserService:
    @staticmethod
    async def get_by_clerk_id(db: AsyncSession, clerk_id: str) -> Optional[User]:
        """Fetch a user by their Clerk user ID."""
        result = await db.execute(
            select(User).where(User.clerk_id == clerk_id)
        )
        return result.scalars().first()

    @staticmethod
    async def create_from_clerk(
        db: AsyncSession,
        clerk_id: str,
        email: str,
        name: Optional[str] = None
    ) -> User:
        """Create a persistent user using Clerk details."""
        user = User(
            clerk_id=clerk_id,
            email=email,
            name=name,
            is_active=True
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def update_profile(
        db: AsyncSession,
        user: User,
        name: Optional[str] = None
    ) -> User:
        """Update a user's details."""
        if name is not None:
            user.name = name
        await db.commit()
        await db.refresh(user)
        return user
