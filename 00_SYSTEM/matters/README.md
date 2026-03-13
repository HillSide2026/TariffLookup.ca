---
id: 00_system__matters__readme_md
title: Matter Identity Map
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-15
last_updated: 2026-02-15
tags: [matters, identity, routing, map]
---

# Matter Identity Map

This folder defines the **system-level canonical mapping** between external identifiers
and internal `matter_id` values. It is the single routing primitive for cross-system
aliases (e.g., Clio matter IDs, Gmail thread IDs, SharePoint folder IDs).

## Rules
- Aliases may be auto-discovered, but **must be marked `needs_ml1_review: true`** until approved.
- Integration contracts may reference this map for routing and attribution.
- This map does not replace `05_MATTERS/**/MATTER.yaml`; it complements it.

## Canonical File
- `matter_identity_map.yaml`
