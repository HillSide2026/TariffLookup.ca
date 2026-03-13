---
id: 10_archive__initiatives__system_portfolio__stage3__stage3_1__stage3_1_interaction_model_md
title: Stage 3.1 — Interaction Model
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Stage 3.1 — Interaction Model

## Purpose

Define the only permitted actions on Stage 3 artifacts, and explicitly forbid actions that create authority, approval, or execution.

---

## The Three Allowed Actions

| Action | Definition | Result |
|--------|------------|--------|
| **Use** | Copy parts into your own work | Content becomes yours after rewriting |
| **Ignore** | Do nothing with the artifact | Artifact remains, unused |
| **Delete** | Remove from view | Artifact is gone |

These are the ONLY permitted interactions with Stage 3 content.

---

## Explicitly Forbidden Actions

| Forbidden Action | Why Forbidden | What It Would Create |
|------------------|---------------|----------------------|
| **Approve** | Implies correctness | Authority |
| **Accept** | Implies completion | Authority |
| **Confirm** | Implies agreement | Authority |
| **Send** | Creates execution | Execution |
| **Promote** | Creates workflow | Pipeline |
| **Queue** | Creates persistence | Work item |
| **Schedule** | Creates future action | Execution |
| **Assign** | Creates responsibility | Authority |
| **Complete** | Implies done | False completion |
| **Submit** | Creates handoff | Execution |

---

## Design Implications

### No "Approve" Button

There is no affordance that says:
- "Looks good"
- "Accept"
- "Use this"
- "Apply"

If such an affordance exists, it must be removed before Stage 3.2.

### No "Ready" State

Stage 3 artifacts never have a state that implies:
- "This is done"
- "This is ready to use"
- "This is correct"

All artifacts are perpetually "draft-like" by design.

### No Downstream Effects

Using a Stage 3 artifact must not:
- Create a record elsewhere
- Update any status
- Trigger any workflow
- Notify anyone
- Change any system state

The artifact is purely local to the thinking session.

---

## Interaction Metaphor

**Stage 3 artifacts are scratch paper, not forms.**

| Property | Scratch Paper | Form |
|----------|---------------|------|
| Purpose | Thinking aid | Official record |
| Lifespan | Temporary | Permanent |
| Authority | None | Binding |
| Action | Crumple/use/discard | Submit/file/process |

Stage 3 outputs are scratch paper.
Stage 2 proposals are forms.

---

## "Use" Action Detail

When you "use" a Stage 3 artifact:

1. You copy relevant parts
2. You rewrite them in your voice
3. The result is YOUR content
4. The origin artifact can be discarded

**The output is not the artifact — the output is what you write after seeing it.**

---

## "Ignore" Action Detail

When you "ignore" a Stage 3 artifact:

1. You don't copy anything
2. The artifact may remain visible
3. No record is kept of "ignoring"
4. No consequence occurs

**Ignoring is the default. No action needed.**

---

## "Delete" Action Detail

When you "delete" a Stage 3 artifact:

1. The artifact is removed from view
2. No record is kept
3. No undo is required
4. Deletion is cheap

**Delete should feel as easy as closing a browser tab.**

---

## Test: Is This Stage 3 Compliant?

Ask these questions:

| Question | Required Answer |
|----------|-----------------|
| Can I "approve" this? | No |
| Does it feel ready to send? | No |
| Does it create a work item? | No |
| Can I schedule it? | No |
| Is deletion scary? | No |
| Do I need to do anything with it? | No |

If any answer is wrong, the interaction model has failed.

---

## Failure Recovery

If forbidden actions become possible:

1. **Pause** Stage 3 development
2. **Remove** the forbidden affordance
3. **Verify** no artifacts entered Stage 2 systems
4. **Resume** only after guardrails are fixed

---

## Governance

- Interaction model is enforced by design, not discipline
- If users can work around it, the design is wrong
- Any new action type requires Stage 3.1 review
