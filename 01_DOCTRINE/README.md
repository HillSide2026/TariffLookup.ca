---
id: 01_doctrine__readme_md
title: Doctrine
owner: ML1
status: draft
version: 1.0
created_date: 2026-01-25
last_updated: 2026-01-25
tags: []
---

# Doctrine

Doctrine is the system's authoritative guidance. It is organized by type and aligned to the quality hierarchy.

## 01_invariants (Level 1)
Structural properties that must remain true for system coherence and validity.
If violated, system integrity is broken and formal amendment is required.

## 02_interpretive
Clarifications and judgment guidance when binding doctrine does not uniquely determine an outcome.
Interpretive doctrine does not override binding doctrine.

## 03_capability_profiles
Opt-in profiles that grant scoped, revocable relaxations to default agent constraints.

## 04_procedural
Governance and change-control doctrine: how doctrine and system rules are reviewed, approved, versioned, deprecated, and migrated.

## 01_principles (Level 2)
Interpretive values that guide policy formation.

## 02_policies (Level 3)
Binding constraints derived from principles.

## 03_protocols (Level 4)
Operational enforcement rules that implement policies as conditional logic.

## rules
Atomic, executable rule fragments used by protocols (reserved for Stage 5).

## tests
Fixtures that validate rules and protocol behavior.

## Classification rule
- "must / required / never / always" (structural) → invariants
- "must / required / never / always" (behavioral) → policies
- "means / applies when / examples / principles" → interpretive or principles
- "review / approval / version / deprecate / change control" → procedural
