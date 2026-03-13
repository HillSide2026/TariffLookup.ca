---
id: 02_playbooks__corporate__agents__readme_md
title: Corporate Playbook Agents
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Corporate Playbook Agents

Agent role specifications and supporting references for the Corporate Playbooks system.

---

## Purpose

Define agent roles that operate within the Corporate Playbooks system. Specifications describe:
- What the agent does (expertise + constraints)
- How it produces outputs (schema + confidence)
- How it makes decisions (registry + defaults)
- When it escalates (triggers + gates)

---

## Relationship to Doctrine

| Layer | Purpose |
|-------|---------|
| Agent Doctrine (DOCTRINE-AGENTS-0001) | Universal constraints on all agents |
| Capability Profiles | Permissions granted to specific roles |
| **Agent Role Specifications** | What a specific agent type does |
| **Supporting References** | Operational resources for agent behavior |

An agent must comply with Doctrine, may be granted Capability Profile permissions, operates according to its Role Specification, and consults Supporting References.

---

## Agent Index

| Agent | Scope |
|-------|-------|
| [CORPORATE_LAW_MASTER_AGENT](CORPORATE_LAW_MASTER_AGENT.md) | Expert Ontario corporate law; Solution navigation; structured output |

---

## Supporting References

| File | Purpose |
|------|---------|
| [DECISION_REGISTRY.md](DECISION_REGISTRY.md) | Named decision points with reason codes (D01–D07) |
| [KNOWN_SAFE_DEFAULTS.md](KNOWN_SAFE_DEFAULTS.md) | Default positions for recurring choices |
| [SOLUTION_COLLISION_MATRIX.md](SOLUTION_COLLISION_MATRIX.md) | Multi-solution routing and sequencing |
| [INTAKE_QUESTION_PACKS.md](INTAKE_QUESTION_PACKS.md) | Minimum viable fact sets per Solution |

---

## Key Concepts

### Output Schema
Every agent response follows a fixed structure: Matter Classification, Decision Points, Assumptions, Plan, Risks, Escalations, Artifacts.

### Confidence Model
Three bands (HIGH/MEDIUM/LOW) tied to action gates, not vibes. LOW = stop + escalate.

### Assumption Discipline
Max 3 assumptions before intake questions. All assumptions typed. `A_LEGAL_DEPENDENCY` always escalates.

### Self-QA Checklist
Critique step before output delivery. Failure = revise.

---

## Mental Model

```
Solutions = codified firm strategy, defaults, risk tolerances, known patterns

Agent expertise = the ability to:
  • interpret facts
  • recognize patterns
  • choose how to use Solutions
  • identify when Solutions are insufficient

The agent reasons first, then anchors its actions in Solutions.
Solutions do not replace expertise — they discipline it.
```
