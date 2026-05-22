import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.models.organization import Organization, OrganizationMembership


class OrgService:
    @staticmethod
    async def get_by_clerk_id(db: AsyncSession, clerk_org_id: str) -> Optional[Organization]:
        """Fetch an organization by its Clerk organization ID."""
        result = await db.execute(
            select(Organization).where(Organization.clerk_org_id == clerk_org_id)
        )
        return result.scalars().first()

    @staticmethod
    async def create_from_clerk(
        db: AsyncSession,
        clerk_org_id: str,
        name: str,
        slug: str
    ) -> Organization:
        """Create a persistent organization using Clerk details."""
        org = Organization(
            clerk_org_id=clerk_org_id,
            name=name,
            slug=slug
        )
        db.add(org)
        await db.commit()
        await db.refresh(org)
        return org

    @staticmethod
    async def update_org(
        db: AsyncSession,
        org: Organization,
        name: Optional[str] = None,
        slug: Optional[str] = None
    ) -> Organization:
        """Update organization details."""
        if name is not None:
            org.name = name
        if slug is not None:
            org.slug = slug
        await db.commit()
        await db.refresh(org)
        return org

    @staticmethod
    async def get_membership(
        db: AsyncSession,
        user_id: uuid.UUID,
        organization_id: uuid.UUID
    ) -> Optional[OrganizationMembership]:
        """Fetch membership details for user and organization."""
        result = await db.execute(
            select(OrganizationMembership).where(
                (OrganizationMembership.user_id == user_id) &
                (OrganizationMembership.organization_id == organization_id)
            )
        )
        return result.scalars().first()

    @staticmethod
    async def sync_membership(
        db: AsyncSession,
        user_id: uuid.UUID,
        organization_id: uuid.UUID,
        role: str
    ) -> OrganizationMembership:
        """Upsert membership mapping role."""
        membership = await OrgService.get_membership(db, user_id, organization_id)
        if membership:
            if membership.role != role:
                membership.role = role
                await db.commit()
                await db.refresh(membership)
        else:
            membership = OrganizationMembership(
                user_id=user_id,
                organization_id=organization_id,
                role=role
            )
            db.add(membership)
            await db.commit()
            await db.refresh(membership)
        return membership

    @staticmethod
    async def get_user_memberships(
        db: AsyncSession,
        user_id: uuid.UUID
    ) -> List[OrganizationMembership]:
        """Retrieve all organization memberships for a user, preloading organizations."""
        result = await db.execute(
            select(OrganizationMembership)
            .where(OrganizationMembership.user_id == user_id)
            .options(selectinload(OrganizationMembership.organization))
        )
        return list(result.scalars().all())
