---
id: 02_playbooks__system__prep_day_md
title: Runbook: prep_day (v0.1)
owner: ML1
status: draft
version: 1.0
created_date: 2026-02-26
last_updated: 2026-02-26
tags: [runbook, mcp, calendar]
---
# Runbook: prep_day (v0.1)

## Intent
Generate a schedule brief for today + upcoming window and a prep packet for the next meeting.

## Inputs
- start_ts: ISO-8601 (default: now)
- window_days: integer (default 7; max 14 without Manual)
- optional: calendars: array<string>

## Steps (Capabilities)
1) Calendar.ListEvents (Auto)
2) Generate schedule brief (Local, Auto)
   - `outputs/brief.md`
3) Identify next meeting (Local, Auto)
4) Calendar.GeneratePrepPacket (Auto)
   - `outputs/prep_packets/<event_id>.md`
   - `outputs/prep_packets/<event_id>_followups.md`

## Outputs (Required)
- `outputs/brief.md`
- `outputs/prep_packets/<event_id>.md`
- `outputs/prep_packets/<event_id>_followups.md`
- actions.jsonl + manifest.json

## Approval Gates
- All steps Auto (read-only + local artifacts). No calendar modifications.

## Failure Modes
- No events in window: outputs/brief.md indicates empty schedule; manifest/actions still produced.
- Window exceeds constraints: result=blocked; outputs/brief.md explains constraint and required Manual approval.

## Audit
- All actions logged and outputs indexed in manifest.
