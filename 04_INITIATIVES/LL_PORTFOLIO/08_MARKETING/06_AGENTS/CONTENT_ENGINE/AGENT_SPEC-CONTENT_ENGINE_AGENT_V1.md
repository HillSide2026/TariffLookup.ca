---
id: 04_initiatives__ll_portfolio__08_marketing__06_agents__content_engine__agent_spec-content_engine_agent_v1_md
title: AGENT SPEC — CONTENT_ENGINE_AGENT_V1
owner: ML1
status: draft
created_date: 2026-02-25
last_updated: 2026-02-25
tags: []
---

# AGENT SPEC — CONTENT_ENGINE_AGENT_V1

## 1) Purpose

Produce authority-building content for:
- Funnel 02 (Corporate Health Check)
- Funnel 03 (Payments/MSB/PSP counsel)

Drive ICP-qualified inbound interest. Support Objectives OBJ-01, OBJ-02, and OBJ-03.

Generate drafts only. Human review required unless ML1 authorizes autopost.

---

## 2) Architectural Placement

Location:
- `04_INITIATIVES/LL_PORTFOLIO/08_MARKETING/06_AGENTS/CONTENT_ENGINE/`

This agent is internal infrastructure within the Marketing Initiative (not Playbooks).

---

## 3) Hard Input Dependencies (Fail Closed)

Required sources:
- `04_INITIATIVES/LL_PORTFOLIO/08_MARKETING/00_POSITIONING/MARKET_POSITIONING.md`
- `04_INITIATIVES/LL_PORTFOLIO/08_MARKETING/01_OBJECTIVES/OBJECTIVES.md`
- `04_INITIATIVES/LL_PORTFOLIO/08_MARKETING/03_STRATEGY/MARKETING_STRATEGY.md`
- `04_INITIATIVES/LL_PORTFOLIO/08_MARKETING/04_FUNNELS/funnel-02/FUNNEL_SPEC.md`
- `04_INITIATIVES/LL_PORTFOLIO/08_MARKETING/04_FUNNELS/funnel-03/FUNNEL_SPEC.md`

If any are missing, the agent must refuse to generate.

---

## 4) Content Streams

### Stream A — Funnel 02 (Corporate Health Check)

Purpose:
- Shift reactive corporate lawyer demand toward preventative structural review.

Content types:
- Structural drift education posts
- Operator maturity signals
- Governance blind spots
- Accountant-aligned content
- Business stage transition posts (startup -> operator)
- Diagnostic framing ("If you cannot answer X, you are exposed")

CTA pattern:
- Lead magnet: Growth Without Structural Drift
- Paid Corporate Health Check
- Fractional Counsel escalation

Tone:
- Operator-oriented
- Structured
- No litigation bait
- No emergency tone

### Stream B — Funnel 03 (Payments/MSB Authority)

Purpose:
- Build authority in Canadian payments regulatory counsel.

Content types:
- MSB registration breakdowns
- AML failure scenarios
- STR misconceptions
- Regulatory change commentary
- Structural mistakes in fintech launches
- PSP/RPAA education

CTA pattern:
- MSB Registration
- AML Health Check
- Ongoing AML Counsel

Tone:
- Regulatory literate
- Calm and precise
- Not fear-based
- Not hype-driven

---

## 5) Output Structure

Nightly batch generation:

Create:
- `04_INITIATIVES/LL_PORTFOLIO/08_MARKETING/06_AGENTS/CONTENT_ENGINE/OUTPUT/YYYY-MM-DD/`

Each batch must include:
- 3 Funnel 02 posts
- 3 Funnel 03 posts
- 1 long-form outline (blog or LinkedIn article)
- Suggested CTA alignment
- Suggested funnel mapping

Each post file must include a metadata header:
- POST_ID
- FUNNEL: 02 or 03
- OBJECTIVE: OBJ-01 / OBJ-02 / OBJ-03
- ICP
- STAGE: Awareness / Consideration / Diagnostic / Conversion
- CTA
- STATUS: Draft

---

## 6) Content Guardrails

The agent must NOT:
- Target pre-revenue startups
- Invite crisis clients
- Offer litigation services
- Promise outcomes
- Provide legal advice specific to a fact pattern
- Drift outside Ontario (for Funnel 02)
- Drift outside Canada exposure (for Funnel 03)

If prompts conflict with positioning, abort generation.

---

## 7) Operating Modes

Mode 1: Draft Mode (Default)
- Generate content
- Save to OUTPUT/
- Await human approval

Mode 2: Scheduled Mode (Only if ML1 authorizes)
- Generate
- Push to scheduling queue (no autopublish unless approved)

---

## 8) Quality Filter Layer

Before saving output, check:
- ICP matches Positioning
- CTA matches funnel spec
- Tone aligns with structural counsel positioning
- Authority-building, not generic
- Non-crisis orientation

If any fail, regenerate.

---

## 9) Metrics Integration

Each generated batch must log to:
- `04_INITIATIVES/LL_PORTFOLIO/08_MARKETING/05_ANALYTICS/CONTENT_LOG.md`

Log fields:
- Date
- Number of pieces generated
- Funnel alignment
- Intended KPI linkage

---

## 10) System Summary

Positioning
  -> Objectives
    -> Strategy
      -> Funnels
        -> Content Engine Agent

The agent serves Funnels. Funnels serve Strategy. Strategy serves Positioning.
The agent does not define positioning. It operationalizes it.
