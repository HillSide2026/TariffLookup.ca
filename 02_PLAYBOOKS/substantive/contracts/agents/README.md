---
id: 02_playbooks__contracts__agents__readme_md
title: Contract Playbook Agents
owner: ML1
status: draft
version: 1.0
supersedes:
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

## Playbook Header
Playbook ID: 02_playbooks__contracts__agents__readme_md
Version: 1.0
Status: draft

Principles Referenced: PRN-001, PRN-002, PRN-003, PRN-004, PRN-005, PRN-006, PRN-009
Policies Applied: POL-003, POL-004, POL-005, POL-006, POL-009, POL-011
Protocols Enforced: PRO-003, PRO-004, PRO-005, PRO-006, PRO-009, PRO-011
Doctrine Invoked: 00_SYSTEM/constitution.md, 01_DOCTRINE/index.yaml

Inputs: TBD
Outputs: TBD
Acceptance Criteria: TBD


# Contract Playbook Agents

Agent role specifications and supporting references for the Contracts practice area.

---

## Purpose

Define agent roles that operate within the Contracts Playbooks system. Specifications describe:
- What the agent does (expertise + constraints)
- How it produces outputs (schema + confidence)
- How it makes decisions (registry + defaults)
- When it escalates (triggers + gates)

---

## Relationship to System Architecture

| Layer | Purpose |
|-------|---------|
| Agent Typology | Type 2: Practice Area Master Agent |
| Generic Spec | [PRACTICE_AREA_MASTER_AGENT_SPEC](../../../../00_SYSTEM/agents/specs/PRACTICE_AREA_MASTER_AGENT_SPEC.md) |
| Agent Doctrine | [DOCTRINE-AGENTS-0001](../../../../01_DOCTRINE/01_invariants/DOCTRINE-AGENTS-0001-SECOND-BRAIN_AGENT_AUTHORITY.md) |
| **This Instantiation** | Contracts-specific expertise and decision points |

---

## Agent Index

| Agent | Scope |
|-------|-------|
| [CONTRACTS_MASTER_AGENT](CONTRACTS_MASTER_AGENT.md) | Expert contract law; Solution navigation; structured output |

---

## Supporting References

| File | Purpose |
|------|---------|
| [DECISION_REGISTRY.md](DECISION_REGISTRY.md) | Named decision points for contracts |
| [KNOWN_SAFE_DEFAULTS.md](KNOWN_SAFE_DEFAULTS.md) | Default positions for standard contracts |
| [SOLUTION_COLLISION_MATRIX.md](SOLUTION_COLLISION_MATRIX.md) | Multi-solution routing and sequencing |
| [INTAKE_QUESTION_PACKS.md](INTAKE_QUESTION_PACKS.md) | Minimum viable fact sets per Solution |
