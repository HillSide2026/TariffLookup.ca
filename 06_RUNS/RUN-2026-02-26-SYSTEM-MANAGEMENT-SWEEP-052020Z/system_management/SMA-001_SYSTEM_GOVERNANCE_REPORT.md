---
id: sma_001_system_governance_report
title: System Governance Report
owner: ML1
status: draft
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [system-management, run]
---
## Summary
- Scope: working tree changes (31 files).
- Governed changes reviewed: 31.
- Folder placement: PASS (no off-map roots detected in governed changes).
- Frontmatter compliance: FAIL (checked 16 markdown files).

## Findings
1. Missing YAML frontmatter in 15 file(s): 00_SYSTEM/DASHBOARD.md, 01_DOCTRINE/01_invariants/no_autonomous_publish.md, 01_DOCTRINE/02_policies/system_mcp_policy.md, 01_DOCTRINE/03_capability_profiles/calendar.generate_prep_packet.md, 01_DOCTRINE/03_capability_profiles/calendar.list_events.md, 01_DOCTRINE/03_capability_profiles/gmail.create_draft.md, 01_DOCTRINE/03_capability_profiles/gmail.get_thread.md, 01_DOCTRINE/03_capability_profiles/gmail.search_threads.md, 01_DOCTRINE/03_capability_profiles/sharepoint.copy_template_to_wip.md, 01_DOCTRINE/03_capability_profiles/sharepoint.diff_docs.md, 01_DOCTRINE/03_capability_profiles/sharepoint.find_latest_template.md, 02_PLAYBOOKS/system/draft_followup.md, 02_PLAYBOOKS/system/prep_day.md, 02_PLAYBOOKS/system/template_to_wip.md, 06_RUNS/_RUN_TEMPLATE/README.md

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
