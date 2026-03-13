---
id: 06_runs__03_tests__agent_outputs__sys-005_test_output_md
title: Governance Compliance Report
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Governance Compliance Report

**Agent:** SYS-005 — System Governance
**Version:** v0.1
**Date:** 2026-01-27
**Scope:** PR Changeset Review (03_TESTS/fixtures/pr_changeset/)

---

## Summary

- Reviewed 3 files in test fixture PR changeset
- Found 2 compliance issues requiring remediation
- 1 file passed all governance checks
- 1 folder placement violation (doctrine content in wrong location)
- 1 schema violation (missing YAML frontmatter)

---

## Findings

1. **new_playbook.md** — Schema Violation
   - Change Type: Content (new playbook)
   - Folder Placement: Valid (test fixture, would be `02_PLAYBOOKS/` in production)
   - Schema Compliance: **FAIL** — Missing YAML frontmatter
   - Doctrine Alignment: N/A (not doctrine content)
   - Status: **REQUIRES REMEDIATION**

2. **modified_runbook.md** — Compliant
   - Change Type: Content (runbook modification)
   - Folder Placement: Valid
   - Schema Compliance: **PASS** — Valid YAML frontmatter present
   - Doctrine Alignment: N/A (not doctrine content)
   - Status: **APPROVED**

3. **wrong_folder_doc.md** — Folder Placement Violation
   - Change Type: Doctrine
   - Folder Placement: **FAIL** — Doctrine content in `03_TESTS/fixtures/pr_changeset/`
   - Required Location: `01_DOCTRINE/01_invariants/`
   - Schema Compliance: Partial (has Status/Authority fields, not full YAML block)
   - Doctrine Alignment: Content claims BINDING authority
   - Status: **REQUIRES REMEDIATION + ML1 APPROVAL**

---

## Recommendations

1. **new_playbook.md**: Add required YAML frontmatter
   ```yaml
   ---
   title: Agent Testing Playbook
   status: draft
   author: [author]
   last_updated: 2026-01-27
   ---
   ```

2. **wrong_folder_doc.md**:
   - Move to `01_DOCTRINE/01_invariants/`
   - Rename to follow doctrine naming convention: `DOCTRINE-2026-XXX-*.md`
   - **Escalate to ML1** — Doctrine promotion requires explicit approval

---

## Actions

- [ ] Add YAML frontmatter to new_playbook.md
- [ ] Escalate wrong_folder_doc.md to ML1 for doctrine approval
- [ ] Move wrong_folder_doc.md to 01_DOCTRINE/01_invariants/ after approval
- [ ] Re-run governance check after remediation

---

## Evidence

- 03_TESTS/fixtures/pr_changeset/new_playbook.md:1 — Starts with `# New Playbook` (no YAML frontmatter)
- 03_TESTS/fixtures/pr_changeset/wrong_folder_doc.md:3 — Contains `**Status:** BINDING`
- 03_TESTS/fixtures/pr_changeset/wrong_folder_doc.md:4 — Contains `**Authority:** ML1`
- 01_DOCTRINE/01_invariants/DOCTRINE-2026-004-STAGE_PHASE_NUMBERING.md — Reference for doctrine format

---

## Assumptions / Confidence

- High confidence: Frontmatter detection based on absence of `---` block at file start
- High confidence: Doctrine classification based on "BINDING" and "Authority" keywords
- Assumed: Test fixtures simulate production artifact locations
- Note: This is a test run; no actual files will be modified
