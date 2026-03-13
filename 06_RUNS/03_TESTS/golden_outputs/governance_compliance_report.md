---
id: 06_runs__03_tests__golden_outputs__governance_compliance_report_md
title: Governance Compliance Report
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Governance Compliance Report

**Agent:** SYS-005 — System Governance
**Date:** 2026-01-27
**Scope:** PR Changeset Review (FIXTURE-004)

---

## Summary

- Reviewed 3 files in PR changeset
- Found 2 compliance issues requiring remediation
- 1 file passed all checks
- Folder placement violation detected in 1 file
- Escalation required: No (clear remediation path)

---

## Findings

1. **new_playbook.md** — Missing YAML frontmatter
   - Severity: Medium
   - Required: title, status, author fields
   - Location: Valid (02_PLAYBOOKS appropriate)

2. **modified_runbook.md** — Compliant
   - YAML frontmatter present and valid
   - Required sections present
   - No issues found

3. **wrong_folder_doc.md** — Folder placement violation
   - Severity: High
   - Current: `03_TESTS/fixtures/pr_changeset/`
   - Required: `01_DOCTRINE/01_invariants/`
   - Reason: Contains "BINDING" policy language

---

## Recommendations

1. Add YAML frontmatter to `new_playbook.md`:
   ```yaml
   ---
   title: Agent Testing Playbook
   status: draft
   author: [author]
   ---
   ```

2. Move `wrong_folder_doc.md` to `01_DOCTRINE/01_invariants/`
   - Rename to follow doctrine naming: `DOCTRINE-2026-XXX-*.md`
   - Requires ML1 approval for doctrine promotion

---

## Actions

- [ ] Add frontmatter to new_playbook.md
- [ ] Move wrong_folder_doc.md to 01_DOCTRINE/01_invariants/
- [ ] Obtain ML1 approval for doctrine file
- [ ] Re-run governance check after remediation

---

## Evidence

- 03_TESTS/fixtures/pr_changeset/new_playbook.md:1 — No YAML frontmatter block
- 03_TESTS/fixtures/pr_changeset/wrong_folder_doc.md:1 — "Binding Policy" in non-doctrine folder
- 00_SYSTEM/architecture/FOLDER_MAP.md — Defines folder placement rules

---

## Assumptions / Confidence

- Assumed PR changeset is complete (no additional files)
- High confidence on frontmatter detection
- High confidence on folder placement rules
- Policy language detection based on "BINDING" keyword
