from enum import Enum
from typing import Dict, List, Set


class Role(str, Enum):
    ADMIN = "Admin"
    MANAGER = "Manager"
    AUDITOR = "Auditor"
    VIEWER = "Viewer"


# Define fine-grained permissions
class Permission(str, Enum):
    DOCUMENT_READ = "document:read"
    DOCUMENT_WRITE = "document:write"
    DOCUMENT_DELETE = "document:delete"
    WORKFLOW_READ = "workflow:read"
    WORKFLOW_RUN = "workflow:run"
    WORKFLOW_WRITE = "workflow:write"
    TASK_READ = "task:read"
    TASK_WRITE = "task:write"
    AUDIT_LOG_READ = "audit_log:read"
    SETTINGS_READ = "settings:read"
    SETTINGS_WRITE = "settings:write"


# Mapping of roles to permissions
ROLE_PERMISSIONS: Dict[Role, Set[Permission]] = {
    Role.ADMIN: {
        Permission.DOCUMENT_READ,
        Permission.DOCUMENT_WRITE,
        Permission.DOCUMENT_DELETE,
        Permission.WORKFLOW_READ,
        Permission.WORKFLOW_RUN,
        Permission.WORKFLOW_WRITE,
        Permission.TASK_READ,
        Permission.TASK_WRITE,
        Permission.AUDIT_LOG_READ,
        Permission.SETTINGS_READ,
        Permission.SETTINGS_WRITE,
    },
    Role.MANAGER: {
        Permission.DOCUMENT_READ,
        Permission.DOCUMENT_WRITE,
        Permission.WORKFLOW_READ,
        Permission.WORKFLOW_RUN,
        Permission.WORKFLOW_WRITE,
        Permission.TASK_READ,
        Permission.TASK_WRITE,
        Permission.AUDIT_LOG_READ,
        Permission.SETTINGS_READ,
    },
    Role.AUDITOR: {
        Permission.DOCUMENT_READ,
        Permission.WORKFLOW_READ,
        Permission.WORKFLOW_RUN,
        Permission.TASK_READ,
        Permission.TASK_WRITE,
        Permission.AUDIT_LOG_READ,
    },
    Role.VIEWER: {
        Permission.DOCUMENT_READ,
        Permission.WORKFLOW_READ,
        Permission.TASK_READ,
        Permission.AUDIT_LOG_READ,
    },
}


def has_permission(role: str, permission: Permission) -> bool:
    """Check if a given role string has the requested permission."""
    try:
        r = Role(role)
        return permission in ROLE_PERMISSIONS.get(r, set())
    except ValueError:
        return False
