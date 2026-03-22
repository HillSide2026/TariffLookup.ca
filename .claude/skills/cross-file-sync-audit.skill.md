# Skill: Cross-File Sync Audit

Purpose:
- Detect and correct mismatches between code, tests, datasets, queue docs, and target-state docs.

Use when:
- a change touches more than one EU coverage surface
- counts or statuses appear inconsistent

Required behavior:
- compare live code paths, tests, data files, and docs
- flag stale counts or outdated status language
- prefer explicit synchronization over silent divergence

Outputs:
- sync audit
- mismatch list
- update checklist
