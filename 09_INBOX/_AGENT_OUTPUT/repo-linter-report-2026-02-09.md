---
id: repo-linter-report-2026-02-09
title: Repo Linter Report
owner: ML1
status: draft
created_date: 2026-02-09
last_updated: 2026-02-09
tags: []
---

# Repo-Linter Report

## Summary
- Expected top-level folders: 11
- Actual top-level folders: 15
- Unmapped top-level folders: 4
- Missing top-level folders: 0
- Markdown files missing frontmatter: 0
- MATTER.yaml files scanned: 35
- MATTER.yaml violations: 0

## Findings
### Structural - Unmapped Top-Level Folders (Medium)
- .claude
- .git
- .github
- scripts

## Safe Fixes (Draft)
- Add YAML frontmatter to markdown files missing it, per `00_SYSTEM/schemas/SCHEMAS.md`.
- Create missing roadmap subfolders under `04_INITIATIVES/SYSTEM_PORTFOLIO/` if they are required by policy.
- Align MATTER.yaml `delivery_status` values with their enclosing folder names and ensure required fields are present.
- Update `00_SYSTEM/architecture/FOLDER_MAP.md` if unmapped top-level folders are sanctioned.

## ML1 Policy Questions
- Are the following top-level folders intentionally outside the folder map, or should `FOLDER_MAP.md` be updated?
- Unmapped top-level folder: .claude
- Unmapped top-level folder: .git
- Unmapped top-level folder: .github
- Unmapped top-level folder: scripts