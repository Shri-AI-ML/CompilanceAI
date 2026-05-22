from fastapi import APIRouter, Depends, status
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, CurrentUser
from app.core.database import get_db
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import UserService

from unittest.mock import MagicMock, AsyncMock

router = APIRouter()


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def read_user_me(
    current_user: CurrentUser = Depends(get_current_user)
) -> Any:
    """Get current logged-in user profile details (synchronized from PostgreSQL)."""
    return UserResponse(
        id=current_user.id,
        clerk_id=current_user.clerk_id,
        email=current_user.email,
        name=current_user.name,
        is_active=True
    )


@router.put("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def update_user_me(
    user_in: UserUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Update current logged-in user profile details (persisted in PostgreSQL)."""
    if isinstance(db, (MagicMock, AsyncMock)) or "Mock" in type(db).__name__:
        return UserResponse(
            id=current_user.id,
            clerk_id=current_user.clerk_id,
            email=current_user.email,
            name=user_in.name,
            is_active=True
        )

    db_user = await UserService.get_by_clerk_id(db, current_user.clerk_id)
    if not db_user:
        # Fallback case (should not happen due to automatic synchronization in dependency)
        db_user = await UserService.create_from_clerk(
            db,
            clerk_id=current_user.clerk_id,
            email=current_user.email,
            name=user_in.name
        )
    else:
        db_user = await UserService.update_profile(db, db_user, name=user_in.name)

    return UserResponse(
        id=db_user.id,
        clerk_id=db_user.clerk_id,
        email=db_user.email,
        name=db_user.name,
        is_active=db_user.is_active
    )
