---
id: sma_001_system_governance_report
title: System Governance Report
owner: ML1
status: draft
created_date: 2026-02-18
last_updated: 2026-02-18
tags: [system-management, run]
---
## Summary
- Scope: working tree changes (29 files).
- Governed changes reviewed: 28.
- Folder placement: PASS (no off-map roots detected in governed changes).
- Frontmatter compliance: FAIL (checked 22 markdown files).

## Findings
1. Missing YAML frontmatter in 6 file(s): 00_SYSTEM/AGENTS/AGENT__MATTER_MANAGEMENT__STAGE_2_11.md, 00_SYSTEM/agents/specs/system_management/SMA-001_SYSTEM_GOVERNANCE.md, 00_SYSTEM/agents/specs/system_management/SMA-002_PORTFOLIO_PLANNING.md, 00_SYSTEM/agents/specs/system_management/SMA-003_INTEGRATION_STEWARD.md, 00_SYSTEM/agents/specs/system_management/SMA-004_KNOWLEDGE_CURATION.md, 00_SYSTEM/agents/specs/system_management/SMA-005_RUNBOOK_QA.md

## Recommendations
1. Add required YAML frontmatter to missing files.

## Actions
- [ ] Add frontmatter to flagged files and re-run compliance review.

## Escalations Required (if any)
- None.

## Evidence
- 00_SYSTEM/architecture/FOLDER_MAP.md:1
- 00_SYSTEM/schemas/SCHEMAS.md:1
- Working tree diff (git status).

## Assumptions / Confidence
- Doctrine alignment not evaluated in this minimal run.
- Scope limited to working tree changes.
