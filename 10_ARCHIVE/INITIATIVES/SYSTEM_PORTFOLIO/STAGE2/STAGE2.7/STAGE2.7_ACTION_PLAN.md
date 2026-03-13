---
id: 10_archive__initiatives__system_portfolio__stage2__stage2_7__stage2_7_action_plan_md
title: Stage 2.7 — Matter Brief Structure
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 2.7 — Matter Brief Structure

## Status

- **Status:** ✅ COMPLETE
- **Owner:** ML1
- **Effective Start:** 2026-01-31
- **Closed:** 2026-01-31
- **Authority Gate:** Structure deployed, content population is ongoing

---

## Stage 2.7 Core Question

> Can we create a consistent, lightweight structure for capturing matter context without creating busywork?

**Stage 2.7 succeeds if the structure makes it easy to add context incrementally, without feeling like a burden.**

---

## 1. Scope Definition

### In-Scope

| Artifact | Purpose |
|----------|---------|
| MATTER_BRIEF.md | One-page overview of matter context |
| FACTS_TIMELINE.md | Chronological event log with sources |
| ISSUES_AND_POSITIONS.md | Issue inventory + ML1 position placeholders |

### Out-of-Scope

| Element | Why Excluded |
|---------|--------------|
| Substantive content | Content population is ongoing, not part of structure rollout |
| Automation | No auto-population; templates only |
| Clio sync | Data remains separate (per field model) |

---

## 2. Templates Created

### MATTER_BRIEF.md

**Purpose:** Single-page matter overview for quick orientation

**Sections:**
- One-paragraph gist
- Parties (Client, Counterparties, Key contacts)
- What's happened so far
- Current posture
- Near-term milestones
- Open questions
- Change log

### FACTS_TIMELINE.md

**Purpose:** Chronological event log with source attribution

**Format:** `YYYY-MM-DD — Event description (source: path or reference)`

### ISSUES_AND_POSITIONS.md

**Purpose:** Issue inventory with ML1 position placeholders

**Sections:**
- Issues (bulleted list)
- ML1 positions (with `[INSERT: ML1 position]` placeholders)
- Decisions log

---

## 3. Deployment Summary

### Templates Added to 03_TEMPLATES/MATTER_TEMPLATE/

| File | Created |
|------|---------|
| MATTER_BRIEF.md | ✅ |
| FACTS_TIMELINE.md | ✅ |
| ISSUES_AND_POSITIONS.md | ✅ |

### Applied to All 21 Existing Matters

| Category | Count | Status |
|----------|-------|--------|
| ESSENTIAL | 3 | ✅ Templates added |
| STRATEGIC | 4 | ✅ Templates added |
| STANDARD | 10 | ✅ Templates added |
| PARKED | 4 | ✅ Templates added |

**Total:** 21 matters × 3 templates = 63 files created

---

## 4. Matter Folder Structure (Final)

```
05_MATTERS/<CATEGORY>/<matter_id>/
├── MATTER.yaml              # Metadata (existing)
├── README.md                # Quick reference (existing)
├── MATTER_BRIEF.md          # NEW: One-page overview
├── FACTS_TIMELINE.md        # NEW: Chronological events
├── ISSUES_AND_POSITIONS.md  # NEW: Issues + positions
├── 01_INTAKE/
├── 02_WORK_PRODUCT/
├── 03_COMMS/
├── 04_ADMIN/
└── 99_ARCHIVE/
```

---

## 5. Exit Criteria

- [x] Templates created in 03_TEMPLATES/MATTER_TEMPLATE/
- [x] Templates applied to all 21 existing matters
- [x] No substantive content populated (templates only)
- [x] Structure supports incremental population

**✅ EXIT CRITERIA MET — 2026-01-31**

---

## 6. Usage Guidelines

### When to Update MATTER_BRIEF.md
- After significant developments
- When matter posture changes
- When onboarding to a matter (first time touching it in a while)

### When to Update FACTS_TIMELINE.md
- After calls, emails, filings
- When learning new facts
- Always include source attribution

### When to Update ISSUES_AND_POSITIONS.md
- When identifying new issues
- After decisions are made
- When ML1 position crystallizes

---

## References

- Matter Field Model: `01_SYSTEM/MATTERS_FIELD_MODEL.md`
- SCHEMAS.md: `00_SYSTEM/schemas/SCHEMAS.md`
- Stage 2.6: `STAGE2.6/STAGE2.6_ACTION_PLAN.md`
