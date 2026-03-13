---
id: 01_doctrine__01_principles__doctrine-2026-006-decision-principles_md
title: DOCTRINE 2026 006 decision principles
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Change Note
Moved from `01_DOCTRINE/01_invariants/` to `01_DOCTRINE/01_principles/` on 2026-02-13 to reflect interpretive principles for judgment.

DOCTRINE-2026-006 — Decision Principles
Status: Principle (Interpretive)
Authority: ML1
Effective Date: 2026-01-24
Scope: System-wide (ML2)

Purpose
This doctrine codifies binding principles that govern judgment and decision-making when procedures, schemas, playbooks, or rules do not fully determine an outcome.
These principles:
Have the same normative force as doctrine
Must be cited in decisions where judgment is exercised
Apply to ML1 judgment, agent recommendations, and system design choices
They close the governance gap between procedural approval and how to decide.

Structure
This document defines two categories of binding principles:
System Principles — define what the system is and how it must behave
Substantive Decision Principles — define how judgment is made under ambiguity
Both are binding. Both are enforceable.

I. System Principles (Identity-Defining)
System Principles constrain architecture, authority, and interpretation. Violation of these principles constitutes system drift.
SP-001 — Authority Is Singular
Statement: ML1 is the sole authority. ML2 encodes, constrains, and records decisions but does not decide.
Implications:
No autonomous policy changes
All binding changes require explicit ML1 approval
Agents may recommend, never decide

SP-002 — ML2 Is the System of Record
Statement: Canonical truth lives in the repository. External tools are outputs, not authorities.
Implications:
If it is not recorded in ML2, it is not binding
External documents must trace back to a canonical artifact

SP-003 — Inspectability by Default
Statement: All rules, workflows, and constraints must be understandable via files, diffs, and history.
Implications:
No opaque automation
No undocumented behavior
Preference for explicit markdown artifacts

SP-004 — No Silent Drift
Statement: Concepts must remain stable over time. Changes require explicit declaration and migration.
Implications:
Renames require refactor plans
Semantic changes require change records
Historical meaning must remain recoverable

SP-005 — Separation of Concerns
Statement: Doctrine governs judgment; schemas define structure; projects define work; agents operate within constraints.
Implications:
No workflows embedded in schemas
No strategy embedded in agents
No execution logic in doctrine

II. Substantive Decision Principles (Judgment-Defining)
These principles govern how choices are made when multiple compliant options exist or when guidance is underdetermined.
They must be followed the same way doctrine is followed.

DP-001 — Prefer Explicit Over Implicit
Statement: When ambiguity exists, resolve it in writing rather than inference.
Implications:
Ambiguous approvals are invalid
Assumptions must be documented
Unwritten intent has no binding force

DP-002 — Reversibility Over Speed
Statement: When uncertain, prefer actions that are easier to undo.
Implications:
Archive before delete
Prefer phased migrations
Avoid irreversible changes under time pressure

DP-003 — Facts Without Interpretation
Statement: Extracted or recorded content must be stripped of judgment and framing.
Implications:
Separate observation from analysis
Store facts independently of conclusions
Interpretation belongs in analysis artifacts

DP-004 — Silence Is Not Consent
Statement: Absence of objection does not constitute approval.
Implications:
Explicit approval is required where specified
Time passage does not legitimize change
Lack of response is non-binding

DP-005 — Minimal Viable Promotion
Statement: Promote the smallest artifact that satisfies the immediate need.
Implications:
Avoid premature canonization
Prefer narrow schemas over broad ones
Promote incrementally with evidence

Enforcement
These principles are citable doctrine
Decisions exercising judgment must reference applicable principles
Violations trigger the same review and correction process as other doctrine violations
Agents must:
Reference relevant principles when surfacing recommendations
Flag conflicts between principles explicitly

Conflict Handling
When principles conflict:
Surface the conflict explicitly
State the tradeoff
Escalate to ML1 for resolution
Record the resolution with principle citations

Change Control
Modifications to this document require explicit ML1 approval
Changes must include rationale and effective date
Deprecated principles must be marked, not removed

End of Doctrine
