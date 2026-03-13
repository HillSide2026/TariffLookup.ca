---
id: 09_inbox__readme_md
title: 09_INBOX — Multi-Source Intake Layer
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# 09_INBOX — Multi-Source Intake Layer

**Purpose:** Temporary holding area for unadjudicated inputs, regardless of origin.

---

## Core Doctrine

> **The inbox tracks uncertainty, not origin. Sources feed the inbox; they do not define it.**

---

## Principle

09_INBOX is **not** a source.

It is a temporary holding layer for information that has entered the system but has not yet been classified, accepted, rejected, or promoted.

**Key distinctions:**

- Source ≠ status
- Inbox is about epistemic state, not transport mechanism
- A document from Gmail and a document from SharePoint are treated identically once inside 00_UNTRIAGED

---

## Structure

```
09_INBOX/
├── README.md                 ← You are here
├── _sources/                 ← Mechanical intake buffers (source-specific)
│   ├── gmail/
│   ├── sharepoint/
│   ├── drive/
│   ├── manual/
│   └── other/
├── 00_UNTRIAGED/             ← Normalized ingress, not yet classified
├── 01_CLASSIFIED_PROPOSALS/  ← System judgment (proposal only)
├── 02_NEEDS_HUMAN/           ← Low confidence, awaiting ML1 review
├── 03_REJECTED_NOISE/        ← Consciously ignored (still auditable)
└── 04_HISTORY/               ← Closed inbox cycles, frozen snapshots
```

---

## Intake Flow (Universal Rule)

Every item entering the system must follow this path:

```
External Source
   ↓
09_INBOX/_sources/<source>/
   ↓ (normalization step)
09_INBOX/00_UNTRIAGED/
   ↓ (classification)
01_CLASSIFIED_PROPOSALS/ or 02_NEEDS_HUMAN/
   ↓ (execution, if authorized)
Canonical location
```

### Examples

| Source | Intake Path | Destination |
|--------|-------------|-------------|
| Gmail | `_sources/gmail/` → normalization → `00_UNTRIAGED/` | |
| SharePoint | `_sources/sharepoint/` → normalization → `00_UNTRIAGED/` | |
| OneDrive/Word | `_sources/drive/` → normalization → `00_UNTRIAGED/` | |
| Manual drop | `_sources/manual/` → normalization → `00_UNTRIAGED/` | |

### Normalization Step

During the move into 00_UNTRIAGED:

- File is renamed to system conventions
- Minimal metadata is attached (frontmatter or filename tag):
  - `source: gmail`
  - `source: sharepoint`
- **No interpretation**
- **No classification**

This keeps the inbox epistemically clean.

---

## Folder Purposes

### _sources/

**What:** Mechanical intake buffers for each external source
**Properties:**
- May reflect quirks of origin systems
- Not decision-relevant
- Transient holding only
- No source has priority by default

**Critical:** Source folders are mechanical. Decisions happen only after normalization.

### 00_UNTRIAGED/

**What:** Normalized inputs awaiting classification
**Answers:** "What has arrived that the system has seen but not yet judged?"
**Properties:** Source-agnostic once normalized

### 01_CLASSIFIED_PROPOSALS/

**What:** Draft Placement Plans, classification outputs
**Answers:** "What does the system believe this inbox contains?"
**Properties:** Proposal-only, machine-generated, never auto-executed

### 02_NEEDS_HUMAN/

**What:** Low-confidence classifications, conflicting signals, Unknown items
**Answers:** "Where does the system refuse to guess?"
**Note:** If this folder is empty forever, the system is overconfident.

### 03_REJECTED_NOISE/

**What:** Spam, marketing, personal noise, explicitly deprioritized items
**Answers:** "What did the system consciously ignore?"
**Properties:** Still logged, still reversible, preserves auditability

### 04_HISTORY/

**What:** Prior inbox runs, frozen snapshots after review, historical audit trail
**Answers:** "What did the system think at that time?"

---

## What Belongs Here

- Raw extracts from any source (Gmail, SharePoint, Drive, manual)
- Classification proposals (Draft Placement Plans)
- Items flagged for human review
- Consciously rejected noise

---

## What Does NOT Belong Here

- Authoritative records
- Executed decisions
- Permanent storage
- Canonical matter files

---

## Key Constraint

**Nothing in 09_INBOX/ is:**

- Authoritative
- Permanent
- Binding
- Executed against

**Everything here is waiting to be understood.**

---

## Source Non-Authority Rule

Sources feed into the inbox via source-specific intake buffers.

**No intake source maps directly to the inbox workflow.**

SharePoint, Gmail, Drive — all are read-only intake sources. They may be read, but they may never define reality.

At no point does any source bypass inbox adjudication.

---

## Movement Policy

Movement **out of** 09_INBOX/ into canonical locations requires:

1. Human approval (ML1)
2. Explicit execution authorization
3. Audit trail

Until execution stages are authorized, items remain here as proposals.

---

## What Stays Undifferentiated

09_INBOX remains undifferentiated in the only place that matters:

- Triage logic
- Classification rules
- Human review
- Promotion pathways

**Source is context, not authority.**

---

## Stage Mapping

| Stage | Writes To |
|-------|-----------|
| 2.2 (Integration) | `_sources/gmail/`, `_sources/sharepoint/`, `_sources/drive/` |
| 2.3 (Pilot) | `00_UNTRIAGED/`, `01_CLASSIFIED_PROPOSALS/`, `02_NEEDS_HUMAN/` |
| 2.4 (Review) | ML1 reviews `01_CLASSIFIED_PROPOSALS/` and `02_NEEDS_HUMAN/` |
| Future (Execution) | Items move out to canonical locations (supervised) |

---

## References

- Taxonomy: `02_PLAYBOOKS/core/inbox_triage/TAXONOMY.md`
- Classifier Interface: `02_PLAYBOOKS/core/inbox_triage/CLASSIFIER_INTERFACE.md`
- Logging Spec: `02_PLAYBOOKS/core/inbox_triage/LOGGING_SPEC.md`
- Draft Placement Plan Schema: `00_SYSTEM/schemas/SCHEMAS_INBOX_TRIAGE.md`
