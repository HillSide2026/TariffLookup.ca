---
id: 02_playbooks__system__template_to_wip_md
title: Runbook: template_to_wip (v0.1)
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [runbook, mcp, sharepoint]
---
# Runbook: template_to_wip (v0.1)

## Intent
Find the latest template and copy it into an allowlisted WIP folder for drafting.

## Inputs
- template_key: string
- template_library_id: string
- destination:
  - dest_site_id: string
  - dest_library_id: string
  - dest_folder_path: string
- new_name: string

## Steps (Capabilities)
1) SharePoint.FindLatestTemplate (Auto)
2) SharePoint.CopyTemplateToWIP (Propose)
   - Must pass allowlist checks (WIP-only)
3) Generate context artifact (Local, Auto)
   - `outputs/sharepoint/<new_doc_id>_context.md` (metadata + links)

## Outputs (Required)
- `outputs/sharepoint/<new_doc_id>_context.md`
- actions.jsonl + manifest.json at run root
- copy mapping logged: source_doc_id -> new_doc_id

## Approval Gates
- Copy to WIP is Propose (allowed external write within WIP only).

## Failure Modes
- Template not found: log fail; emit outputs/sharepoint/template_not_found.md
- Allowlist violation: result=blocked; emit outputs/sharepoint/blocked_destination.md

## Audit
- All actions logged and outputs indexed in manifest.
