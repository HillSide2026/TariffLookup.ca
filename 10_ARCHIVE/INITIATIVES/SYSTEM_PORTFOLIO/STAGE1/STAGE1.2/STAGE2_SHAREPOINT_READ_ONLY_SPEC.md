---
id: 10_archive__initiatives__system_portfolio__stage1__stage1_2__stage2_sharepoint_read_only_spec_md
title: SharePoint Read-Only Integration Specification
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# SharePoint Read-Only Integration Specification

## Scope
- Read-only access to selected SharePoint sites, libraries, and documents.
- Ability to list sites, browse libraries, and retrieve document contents.
- Metadata inspection for documents and folders.

## Non-Scope
- No document upload, edit, delete, or move.
- No permission changes or sharing actions.
- No automation or synchronization.
- No matter-level tagging or promotion.

## Permissions Assumptions
- Tenant-level read-only or visitor permissions.
- Access assumptions documented without credential storage.
- Validation via Microsoft documentation or tenant admin confirmation.

## Audit / Logging Expectations
- Access logging at site/library level where available.
- Logs include user/system identity and accessed resource.
- Retention and review cadence documented.

## Data Objects / Fields
- Site ID / name
- Library name
- Document ID / path
- Metadata fields (author, modified date, content type)
- Document content (read-only)

## Constraints
- Tenant permission complexity.
- Metadata inconsistencies across libraries.
- API throttling and paging limits.

## Open Questions
- Are personal OneDrive locations excluded?
- Are version histories accessible read-only?
- What audit logs are available at tenant level?
