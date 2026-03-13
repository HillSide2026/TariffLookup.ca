---
id: 00_system__integrations__readme_md
title: Integrations
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-15
last_updated: 2026-02-15
tags: [integrations, index]
---

# Integrations

This folder contains integration contracts and documentation for external systems.

## Integration Source Contract
Each integration has a contract file named `<integration_name>_sources.yaml` that defines:
- sources (what is connected)
- ingestion triggers/notes
- consumers (playbooks/run graphs)
- change notes

## Folder Conventions
- `00_SYSTEM/integrations/<integration_name>/README.md`
- `00_SYSTEM/integrations/<integration_name>/<integration_name>_sources.yaml`

## Status Meanings
- initiated: partial artifacts exist; not yet complete
- draft: planned/defined but not implemented
- active: in-use with defined scope and contracts
- deprecated: no longer used
