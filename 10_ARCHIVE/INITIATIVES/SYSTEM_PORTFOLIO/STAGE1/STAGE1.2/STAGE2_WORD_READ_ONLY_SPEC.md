---
id: 10_archive__initiatives__system_portfolio__stage1__stage1_2__stage2_word_read_only_spec_md
title: Microsoft Word Read-Only Integration Specification
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Microsoft Word Read-Only Integration Specification

## Scope
- Read-only access to Microsoft Word documents stored in supported repositories.
- Ability to retrieve document content and basic structure.

## Non-Scope
- No editing, commenting, or track-changes interaction.
- No file conversion or saving.
- No automation or batch processing.

## Permissions Assumptions
- Read-only file access via repository-level permissions.
- Validation via documentation or admin confirmation only.

## Audit / Logging Expectations
- Document access events should be auditable where supported.
- Logs capture document identifier, access time, and identity.

## Data Objects / Fields
- Document ID / filename
- Storage location
- Content text
- Headings and basic structure
- Metadata (author, created/modified dates)

## Constraints
- File format variability (.docx, legacy formats).
- Embedded objects or macros excluded.
- Limited metadata consistency across storage systems.

## Open Questions
- Are comments accessible read-only?
- Are embedded objects ignored or extracted?
- Are password-protected documents excluded?
