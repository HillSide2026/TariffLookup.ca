---
id: inv-ml2-boundary
title: ML2 Ontology Boundary
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-14
last_updated: 2026-02-14
tags: [invariant, boundary, ontology, governance]
---

# ML2 Ontology Boundary (Binding Invariant)

## Invariant
ML2 consists exclusively of governed knowledge artifacts and their operating rules.

## Includes (ML2)
ML2 includes the following governed artifact classes:

- Constitution
- Principles
- Policies
- Protocols
- Playbooks
- Templates
- Runs (evidence)
- Integration specifications (non-secret)

## Excludes (Not ML2)
ML2 explicitly excludes the following artifact classes:

- Runtime logs (telemetry, debug output)
- Scripts and tooling (mechanisms)
- Environment configuration (machine-bound config)
- Secrets (tokens, credentials, key material)
- CI configuration and tooling config
- Repository metadata and container artifacts (e.g., VCS plumbing)

## Test (Boundary Check)
If the system were reimplemented in a different execution engine, ML2 artifacts must remain intact and authoritative.

If an artifact would not survive that migration as authoritative system-of-record content, it is not ML2.

## Implications (Normative)
- System Admin Agents MUST scope enforcement to ML2 artifacts only.
- Integration specifications are ML2 only when non-secret and governance-relevant; credentials/tokens are not ML2.
- Repo/container artifacts MUST NOT be treated as ML2 drift, metadata failures, or registry targets.
