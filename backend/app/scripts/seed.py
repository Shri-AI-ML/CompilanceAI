import asyncio
import hashlib
import sys
import uuid
from datetime import datetime, timedelta
# pyrefly: ignore [missing-import]
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

# Setup python path if needed to run directly
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.database import AsyncSessionLocal
from app.models.user import User
from app.models.organization import Organization, OrganizationMembership
from app.models.audit_log import AuditLog

# Enterprise-grade mock users mapping to realistic Clerk IDs
USERS_DATA = [
    {
        "clerk_id": "user_2tW6P8WpE9S2fS4aY5g1b8k7c9X",
        "email": "elena.rostova@complianceos.ai",
        "name": "Elena Rostova",
        "is_active": True,
        "role_mappings": {
            "acme-compliance": "Admin",
            "globex-global": "Auditor",
        }
    },
    {
        "clerk_id": "user_2tW6P8WpE9S2fS4aY5g1b8k7c9Y",
        "email": "marc.verney@complianceos.ai",
        "name": "Marc Verney",
        "is_active": True,
        "role_mappings": {
            "acme-compliance": "Manager",
            "globex-global": "Auditor",
        }
    },
    {
        "clerk_id": "user_2tW6P8WpE9S2fS4aY5g1b8k7c9Z",
        "email": "bill.lumbergh@complianceos.ai",
        "name": "Bill Lumbergh",
        "is_active": True,
        "role_mappings": {
            "initech-financial": "Admin",
        }
    },
    {
        "clerk_id": "user_2tW6P8WpE9S2fS4aY5g1b8k7c9W",
        "email": "peter.gibbons@complianceos.ai",
        "name": "Peter Gibbons",
        "is_active": True,
        "role_mappings": {
            "initech-financial": "Viewer",
        }
    },
]

# Enterprise-grade mock organizations mapping to Clerk IDs
ORGS_DATA = [
    {
        "clerk_org_id": "org_2tW6P8WpE9S2fS4aY5g1b8k7c9O",
        "name": "Acme Compliance Corp",
        "slug": "acme-compliance",
    },
    {
        "clerk_org_id": "org_globex_global_tech_123",
        "name": "Globex Global Technologies",
        "slug": "globex-global",
    },
    {
        "clerk_org_id": "org_initech_financial_services",
        "name": "Initech Financial Services",
        "slug": "initech-financial",
    },
]


def gen_sha256(text: str) -> str:
    """Generates a realistic sha256 checksum string for audit log integrity."""
    return "sha256:" + hashlib.sha256(text.encode("utf-8")).hexdigest()


async def seed_data(db: AsyncSession):
    print("Clearing existing data...")
    await db.execute(delete(AuditLog))
    await db.execute(delete(OrganizationMembership))
    await db.execute(delete(Organization))
    await db.execute(delete(User))
    await db.commit()

    print("Seeding Users...")
    users_by_email = {}
    for user_data in USERS_DATA:
        user = User(
            clerk_id=user_data["clerk_id"],
            email=user_data["email"],
            name=user_data["name"],
            is_active=user_data["is_active"],
        )
        db.add(user)
        users_by_email[user_data["email"]] = user

    print("Seeding Organizations...")
    orgs_by_slug = {}
    for org_data in ORGS_DATA:
        org = Organization(
            clerk_org_id=org_data["clerk_org_id"],
            name=org_data["name"],
            slug=org_data["slug"],
        )
        db.add(org)
        orgs_by_slug[org_data["slug"]] = org

    # Flush so that IDs are generated for foreign key relations
    await db.flush()

    print("Seeding Memberships...")
    for user_data in USERS_DATA:
        user = users_by_email[user_data["email"]]
        for org_slug, role in user_data["role_mappings"].items():
            org = orgs_by_slug[org_slug]
            membership = OrganizationMembership(
                user_id=user.id,
                organization_id=org.id,
                role=role
            )
            db.add(membership)

    await db.flush()

    print("Seeding Audit Logs...")
    base_time = datetime.utcnow()
    
    # 1. Acme Compliance Corp Audit Logs
    acme_org = orgs_by_slug["acme-compliance"]
    acme_logs = [
        {
            "actor": "elena.rostova@complianceos.ai",
            "action": "document.verify",
            "resource": "DOC-2026-001 (SOC2 Trust Services Security Criteria Policy)",
            "ip_address": "192.168.1.45",
            "status": "Verified",
            "offset_mins": 5,
        },
        {
            "actor": "system.daemon",
            "action": "workflow.evaluate",
            "resource": "WF-001 (Continuous SOC2 Audit Pipeline Check)",
            "ip_address": "10.0.12.8",
            "status": "Verified",
            "offset_mins": 15,
        },
        {
            "actor": "marc.verney@complianceos.ai",
            "action": "organization.switch",
            "resource": "Acme Compliance Corp (ORG-ACME)",
            "ip_address": "195.88.24.120",
            "status": "Verified",
            "offset_mins": 30,
        },
        {
            "actor": "elena.rostova@complianceos.ai",
            "action": "document.access_denied",
            "resource": "DOC-2026-002 (Internal Payroll & Compensations Annex)",
            "ip_address": "192.168.1.45",
            "status": "Warning",
            "offset_mins": 45,
        },
        {
            "actor": "marc.verney@complianceos.ai",
            "action": "policy.create",
            "resource": "POL-2026-NIST-800-53 (Access Control Policy v2)",
            "ip_address": "195.88.24.120",
            "status": "Verified",
            "offset_mins": 60,
        },
        {
            "actor": "elena.rostova@complianceos.ai",
            "action": "api_key.rotate",
            "resource": "Clerk Webhook Authenticator Key",
            "ip_address": "192.168.1.45",
            "status": "Verified",
            "offset_mins": 120,
        },
        {
            "actor": "system.daemon",
            "action": "compliance.audit_run",
            "resource": "ISO-27001-A.9.2 Access Provisioning Review",
            "ip_address": "10.0.12.8",
            "status": "Verified",
            "offset_mins": 180,
        },
    ]

    # 2. Globex Global Technologies Audit Logs
    globex_org = orgs_by_slug["globex-global"]
    globex_logs = [
        {
            "actor": "marc.verney@complianceos.ai",
            "action": "document.verify",
            "resource": "DOC-GLBX-09 (Globex Data Processing Addendum - GDPR)",
            "ip_address": "195.88.24.121",
            "status": "Verified",
            "offset_mins": 10,
        },
        {
            "actor": "elena.rostova@complianceos.ai",
            "action": "compliance.audit_run",
            "resource": "GDPR Article 32 Security of Processing Audit",
            "ip_address": "192.168.1.46",
            "status": "Warning",
            "offset_mins": 25,
        },
        {
            "actor": "system.daemon",
            "action": "workflow.evaluate",
            "resource": "WF-GLBX-02 (Database Encryption Check)",
            "ip_address": "10.0.12.9",
            "status": "Verified",
            "offset_mins": 80,
        },
        {
            "actor": "unknown.actor",
            "action": "user.login_attempt",
            "resource": "Globex API Gateway Endpoint (/v1/ingest)",
            "ip_address": "45.132.89.20",
            "status": "Denied",
            "offset_mins": 140,
        },
    ]

    # 3. Initech Financial Services Audit Logs
    initech_org = orgs_by_slug["initech-financial"]
    initech_logs = [
        {
            "actor": "bill.lumbergh@complianceos.ai",
            "action": "role.update",
            "resource": "User Peter Gibbons -> Role Viewer",
            "ip_address": "203.44.112.5",
            "status": "Verified",
            "offset_mins": 8,
        },
        {
            "actor": "peter.gibbons@complianceos.ai",
            "action": "document.read",
            "resource": "DOC-INI-T12 (Initech Quarterly Security Report)",
            "ip_address": "203.44.112.6",
            "status": "Verified",
            "offset_mins": 20,
        },
        {
            "actor": "bill.lumbergh@complianceos.ai",
            "action": "setting.modify",
            "resource": "MFA Requirements Policy -> Enforced globally",
            "ip_address": "203.44.112.5",
            "status": "Verified",
            "offset_mins": 50,
        },
        {
            "actor": "system.daemon",
            "action": "workflow.evaluate",
            "resource": "WF-INI-88 (Offboarding Policy Compliance Checker)",
            "ip_address": "10.0.12.10",
            "status": "Warning",
            "offset_mins": 90,
        },
        {
            "actor": "peter.gibbons@complianceos.ai",
            "action": "export.audit_logs",
            "resource": "Initech Q2 Audit Ledger Export",
            "ip_address": "203.44.112.6",
            "status": "Verified",
            "offset_mins": 150,
        },
    ]

    # Batch add logs
    all_logs = []
    
    for log in acme_logs:
        log_time = base_time - timedelta(minutes=log["offset_mins"])
        all_logs.append(
            AuditLog(
                organization_id=acme_org.id,
                actor=log["actor"],
                action=log["action"],
                resource=log["resource"],
                ip_address=log["ip_address"],
                status=log["status"],
                integrity_hash=gen_sha256(f"{log['actor']}-{log['action']}-{log_time.isoformat()}"),
                created_at=log_time,
            )
        )

    for log in globex_logs:
        log_time = base_time - timedelta(minutes=log["offset_mins"])
        all_logs.append(
            AuditLog(
                organization_id=globex_org.id,
                actor=log["actor"],
                action=log["action"],
                resource=log["resource"],
                ip_address=log["ip_address"],
                status=log["status"],
                integrity_hash=gen_sha256(f"{log['actor']}-{log['action']}-{log_time.isoformat()}"),
                created_at=log_time,
            )
        )

    for log in initech_logs:
        log_time = base_time - timedelta(minutes=log["offset_mins"])
        all_logs.append(
            AuditLog(
                organization_id=initech_org.id,
                actor=log["actor"],
                action=log["action"],
                resource=log["resource"],
                ip_address=log["ip_address"],
                status=log["status"],
                integrity_hash=gen_sha256(f"{log['actor']}-{log['action']}-{log_time.isoformat()}"),
                created_at=log_time,
            )
        )

    db.add_all(all_logs)
    await db.commit()
    print("Database seeding completed successfully.")


async def main():
    async with AsyncSessionLocal() as session:
        await seed_data(session)


if __name__ == "__main__":
    asyncio.run(main())
