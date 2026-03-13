---
id: 01_doctrine__01_invariants__readme_md
title: Invariants (Level 1)
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-13
last_updated: 2026-02-13
tags: [doctrine, invariants]
---

# Invariants (Level 1)

Definition:
An Invariant is a structural property that must remain true for the system to remain coherent and valid.

Characteristics:
- Architectural, not interpretive.
- Rarely changed.
- Violation breaks system integrity.
- Requires formal amendment to modify.
- Higher than Policies.

Boundary:
Invariants do NOT:
- Govern behavior within workflows.
- Describe quality posture.
- Define enforcement routines.
- Replace Policies.

Classification:
- If a rule governs behavior, it belongs in Policies.
- If it defines enforcement logic, it belongs in Protocols.
- If it defines interpretive posture, it belongs in Principles.
