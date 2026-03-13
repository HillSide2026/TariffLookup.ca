---
id: 02_playbooks__execution__action_taxonomy_md
title: Action Taxonomy
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

## Playbook Header
Playbook ID: 02_playbooks__execution__action_taxonomy_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-009
Policies Applied: POL-001, POL-003, POL-004, POL-005, POL-006, POL-009
Protocols Enforced: PRO-001, PRO-003, PRO-004, PRO-005, PRO-006, PRO-009
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Action Taxonomy

## Purpose

Define which actions are allowed, how they work, and how to reverse them.

---

## Guiding Principle

> Every action must be **discrete**, **reversible**, and **logged**.
> If reversibility is unclear, the action is not allowed.

---

## Allowed Actions (Stage 2.6)

### 1. Mark Processed (ML2 Only)

| Field | Value |
|-------|-------|
| **Action Type** | `mark_processed` |
| **Description** | Create a processing record in local repository |
| **Target** | `06_RUNS/EXECUTION/processed/{id}.md` |
| **External Write** | No |
| **Reversibility** | Delete the file |
| **Risk Level** | Minimal |

**Example:**
```
Create file: 06_RUNS/EXECUTION/processed/19c0a035c2f062a4.md
Reverse: rm 06_RUNS/EXECUTION/processed/19c0a035c2f062a4.md
```

---

### 2. Apply Gmail Label

| Field | Value |
|-------|-------|
| **Action Type** | `apply_label` |
| **Description** | Add a label to a Gmail message |
| **Target** | Gmail message ID + label name |
| **External Write** | Yes (Gmail API) |
| **Reversibility** | Remove the label |
| **Risk Level** | Low |

**Allowed Labels:**
- `ML2/Processed`
- `ML2/Inquiry`
- `ML2/Matter`
- `ML2/Admin`

**Forbidden Labels:**
- Any label starting with `CATEGORY_`
- `INBOX`, `SENT`, `DRAFT`, `SPAM`, `TRASH`
- User-created labels not in allowed list

**Example:**
```
Apply: messages.modify(id, addLabels=['ML2/Processed'])
Reverse: messages.modify(id, removeLabels=['ML2/Processed'])
```

---

### 3. Create Matter Stub

| Field | Value |
|-------|-------|
| **Action Type** | `create_stub` |
| **Description** | Create a draft-only matter placeholder |
| **Target** | `05_MATTERS/stubs/{id}.md` |
| **External Write** | No |
| **Reversibility** | Delete the stub file |
| **Risk Level** | Minimal |

**Stub is NOT:**
- A real matter file
- Visible to clients
- Used for billing or tracking

**Example:**
```
Create: 05_MATTERS/stubs/STUB-20260130-001.md
Reverse: rm 05_MATTERS/stubs/STUB-20260130-001.md
```

---

### 4. Add Classification Note

| Field | Value |
|-------|-------|
| **Action Type** | `add_note` |
| **Description** | Add internal note to classification record |
| **Target** | `06_RUNS/EXECUTION/notes/{id}.md` |
| **External Write** | No |
| **Reversibility** | Delete the note file |
| **Risk Level** | Minimal |

**Example:**
```
Create: 06_RUNS/EXECUTION/notes/NOTE-20260130-001.md
Reverse: rm 06_RUNS/EXECUTION/notes/NOTE-20260130-001.md
```

---

## Forbidden Actions (Stage 2.6)

| Action | Reason |
|--------|--------|
| Reply to email | User-facing, not reversible |
| Send email | User-facing, not reversible |
| Move email to folder | Affects inbox organization |
| Delete email | Data loss risk |
| Archive email | Affects inbox state |
| Create calendar event | User-facing |
| Modify contacts | User-facing |
| Any SharePoint/Word write | Out of scope |
| Any LL-facing output | Requires separate authorization |

---

## Reversibility Checklist

Before proposing any action, verify:

- [ ] Can the action be undone in under 1 minute?
- [ ] Does reversal restore exact prior state?
- [ ] Is reversal documented in the proposal?
- [ ] Has the reversal method been tested?

**If any answer is "No" → Action not allowed.**

---

## Action Proposal Requirements

Every proposal must include:

```json
{
  "action_type": "apply_label",
  "action_target": "message:19c0a035c2f062a4, label:ML2/Processed",
  "action_description": "Apply ML2/Processed label to message",
  "reversibility": {
    "method": "remove_label",
    "command": "messages.modify(id, removeLabels=['ML2/Processed'])",
    "verified": true
  }
}
```

---

## Escalation Path

If an action is needed but not in taxonomy:

1. ML1 notes the need
2. SMA-004 drafts action specification
3. SMA-001 reviews for governance
4. ML1 approves addition to taxonomy
5. Action becomes available

**No shortcuts.** New actions require explicit approval.
