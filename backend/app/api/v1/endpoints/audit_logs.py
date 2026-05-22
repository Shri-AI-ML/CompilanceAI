from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
# pyrefly: ignore [missing-import]
from sqlalchemy import select, func, desc
from typing import Optional

from app.api import deps
from app.core.database import get_db
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLogListResponse, AuditLogResponse

router = APIRouter()


@router.get("/", response_model=AuditLogListResponse)
async def list_audit_logs(
    db: AsyncSession = Depends(get_db),
    current_user: deps.CurrentUser = Depends(deps.RequireRole(["Admin", "Manager", "Auditor", "Viewer"])),
    action: Optional[str] = None,
    actor: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
) -> AuditLogListResponse:
    """
    Retrieve audit logs for the current active organization.
    """
    query = select(AuditLog)
    
    # Restrict to user's active organization to guarantee data isolation
    if current_user.organization_id:
        query = query.where(AuditLog.organization_id == current_user.organization_id)
    else:
        # Fallback for system-level actions without organization context
        query = query.where(AuditLog.organization_id.is_(None))
        
    # Apply filters
    if action:
        query = query.where(AuditLog.action.icontains(action))
    if actor:
        query = query.where(AuditLog.actor.icontains(actor))
    if status:
        query = query.where(AuditLog.status == status)
        
    # Get total count (using a subquery count to be safe with filters)
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Paginated query, newest first
    query = query.order_by(desc(AuditLog.created_at)).offset(offset).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()
    
    # Map to schema response models for typing compatibility
    items_response = [AuditLogResponse.model_validate(item) for item in items]
    
    return AuditLogListResponse(items=items_response, total=total)
