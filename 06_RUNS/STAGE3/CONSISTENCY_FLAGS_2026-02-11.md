---
id: 06_runs__stage3__consistency_flags_2026_02_11_md
title: Stage 3.7 Consistency Flags — Test Packet
owner: ML1
status: draft
created_date: 2026-02-11
last_updated: 2026-02-11
tags: [stage3, consistency, flags, test]
---

# Stage 3.7 — Consistency Flags (Test Packet)

[STAGE-3.7 | CONSISTENCY FLAGS | READ-ONLY]

## Scope
- Packet / artifact set:
  - `06_RUNS/STAGE3/TESTS_3.7_INPUTS/TEST-CC1-PACKET-A.md`
  - `06_RUNS/STAGE3/TESTS_3.7_INPUTS/TEST-CC1-PACKET-B.md`
  - `06_RUNS/STAGE3/TESTS_3.7_INPUTS/TEST-CC2-PACKET.md`
  - `06_RUNS/STAGE3/TESTS_3.7_INPUTS/TEST-CC3-PACKET-A.md`
  - `06_RUNS/STAGE3/TESTS_3.7_INPUTS/TEST-CC3-PACKET-B.md`
- Scan date: 2026-02-11
- Trigger: Stage 3.7 test suite

## Flags

**Flag 1: Contradictory doctrine reference**
- Description: Packet A cites DOCTRINE-ALPHA v1, while Packet B cites DOCTRINE-ALPHA v2 with conflicting rules.
- Sources: `06_RUNS/STAGE3/TESTS_3.7_INPUTS/TEST-CC1-PACKET-A.md`, `06_RUNS/STAGE3/TESTS_3.7_INPUTS/TEST-CC1-PACKET-B.md`

**Flag 2: Outdated template reference**
- Description: Template v2 referenced for intake summary; current version unspecified in packet.
- Sources: `06_RUNS/STAGE3/TESTS_3.7_INPUTS/TEST-CC2-PACKET.md`

**Flag 3: Inconsistent framing**
- Description: One packet uses direct/boundary-first framing while another uses empathetic/relationship-first framing for similar context.
- Sources: `06_RUNS/STAGE3/TESTS_3.7_INPUTS/TEST-CC3-PACKET-A.md`, `06_RUNS/STAGE3/TESTS_3.7_INPUTS/TEST-CC3-PACKET-B.md`

## Notes
- No recommendations provided.
- No actions taken.

[USE / IGNORE / DELETE]
