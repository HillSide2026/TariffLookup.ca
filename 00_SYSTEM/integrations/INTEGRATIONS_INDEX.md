---
id: 00_system__integrations__index_md
title: Integrations Index
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-15
last_updated: 2026-02-15
tags: [integrations, index]
---

# Integrations Index

| Integration ID | Name | Status | Owner | Contract Path | Evidence (paths) | Consumers (paths) | Notes / Gaps |
| --- | --- | --- | --- | --- | --- | --- | --- |
| sharepoint | SharePoint | initiated | ML1 | 00_SYSTEM/integrations/sharepoint/sharepoint_sources.yaml | 00_SYSTEM/integrations/sharepoint/sharepoint_sources.yaml<br>00_SYSTEM/scripts/sharepoint_integration.py<br>00_SYSTEM/scripts/sharepoint_discovery.py<br>00_SYSTEM/scripts/setup_sb_execution.py | 00_SYSTEM/scripts/sharepoint_integration.py<br>00_SYSTEM/scripts/sharepoint_discovery.py<br>00_SYSTEM/scripts/setup_sb_execution.py | Config present; Word drafting handled via microsoft_word contract. Uses 00_SYSTEM/matters/matter_identity_map.yaml for matter_id aliasing/routing. |
| gmail | Gmail | initiated | ML1 | 00_SYSTEM/integrations/gmail/gmail_sources.yaml | 00_SYSTEM/scripts/gmail_integration.py<br>00_SYSTEM/scripts/fetch_gmail.py<br>00_SYSTEM/scripts/gmail_labeler.py<br>06_RUNS/ops/gmail_fetch_latest.json | 00_SYSTEM/scripts/gmail_integration.py<br>00_SYSTEM/scripts/fetch_gmail.py<br>00_SYSTEM/scripts/gmail_labeler.py<br>00_SYSTEM/scripts/run_pilot.py | participant_mapping.yaml remains at 00_SYSTEM/integrations/participant_mapping.yaml. Uses 00_SYSTEM/matters/matter_identity_map.yaml for matter_id aliasing/routing. |
| google_drive | Google Drive | initiated | ML1 | 00_SYSTEM/integrations/google_drive/google_drive_sources.yaml | 00_SYSTEM/scripts/generate_review_pack.py<br>00_SYSTEM/scripts/push_drafts_to_sheets.py<br>00_SYSTEM/scripts/run_matter_dashboard.py | 00_SYSTEM/scripts/generate_review_pack.py<br>00_SYSTEM/scripts/push_drafts_to_sheets.py<br>00_SYSTEM/scripts/run_matter_dashboard.py | Drive access via auth_google (todo_runner); doc IDs configured via env. |
| google_sheets | Google Sheets | initiated | ML1 | 00_SYSTEM/integrations/google_sheets/google_sheets_sources.yaml | 00_SYSTEM/scripts/push_drafts_to_sheets.py<br>00_SYSTEM/scripts/run_matter_dashboard.py | 00_SYSTEM/scripts/push_drafts_to_sheets.py<br>00_SYSTEM/scripts/run_matter_dashboard.py | Sheet IDs configured via env or runtime arguments; no static config in repo. |
| microsoft_word | Microsoft Word | initiated | ML1 | 00_SYSTEM/integrations/microsoft_word/microsoft_word_sources.yaml | 00_SYSTEM/architecture/ARCH-2026-00X-integration-plan.md<br>00_SYSTEM/scripts/sb_graph_bridge.py<br>00_SYSTEM/scripts/extract_template_fields.py<br>00_SYSTEM/scripts/sb_bridge_request.schema.json | 00_SYSTEM/scripts/sb_graph_bridge.py<br>00_SYSTEM/scripts/extract_template_fields.py | Uses Microsoft Graph against SharePoint drive IDs for templates/drafts. |
| onedrive | OneDrive | draft | ML1 | 00_SYSTEM/integrations/onedrive/onedrive_sources.yaml | 00_SYSTEM/architecture/ARCH-2026-00X-integration-plan.md<br>00_SYSTEM/architecture/ARCH-2026-01X-stage1-architecture-map.md |  | Plan-level only; no implementation evidence. |
| google_calendar | Google Calendar | draft | ML1 | 00_SYSTEM/integrations/google_calendar/google_calendar_sources.yaml | 00_SYSTEM/architecture/ARCH-2026-00X-integration-plan.md<br>00_SYSTEM/architecture/ARCH-2026-01X-stage1-architecture-map.md |  | Plan-level only; no implementation evidence. |
| clio | Clio | draft | ML1 | 00_SYSTEM/integrations/clio/clio_sources.yaml | 00_SYSTEM/architecture/ARCH-2026-00X-integration-plan.md<br>00_SYSTEM/architecture/ARCH-2026-01X-stage1-architecture-map.md |  | Plan-level only; no implementation evidence. Uses 00_SYSTEM/matters/matter_identity_map.yaml for matter_id aliasing/routing. |
