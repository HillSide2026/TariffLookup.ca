---
id: 06_runs__inbox_triage__pilot__pilot-2026-01-29__error_analysis_memo_md
title: Error Analysis Memo — Stage 2.4 Workstream B
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Error Analysis Memo — Stage 2.4 Workstream B

**Agent:** SYS-008 — Knowledge Curation
**Date:** 2026-01-29
**Pilot Run:** pilot-2026-01-29
**Input:** ML1 Review Worksheet (9 samples)

---

## Summary

ML1 reviewed 9 representative samples from the pilot run of 100 messages.

| Assessment | Count | Percentage |
|------------|-------|------------|
| Correct (C) | 5 | 56% |
| Acceptable (A) | 3 | 33% |
| Incorrect (I) | 1 | 11% |
| Should be Unknown (U) | 0 | 0% |

**Combined Accuracy (C + A):** 89%
**Target:** ≥ 90%

---

## Error Pattern Analysis

### Pattern 1: Default Fallback Too Aggressive

**Issue:** When no strong signals are detected, the classifier defaults to "Client Communication" — this catches marketing/promotional emails.

**Evidence:**
- Sample #2: "Save and send money with Canada Post" → Classified as Client Communication → Should be Marketing

**Root Cause:** The fallback logic assumes unknown senders are potential clients, but many are actually marketing.

**Proposed Fix:**
- Increase Marketing detection signals (look for promotional language)
- Change default fallback to "Unknown / Needs Human" when confidence < threshold

---

### Pattern 2: Missing "Inquiries" Category

**Issue:** The taxonomy conflates "Client Communication" (existing clients with matters) with "Inquiries" (potential clients, no matter yet).

**Evidence:**
- Sample #1: "Missed Call" from soulpepper.com → Should be Inquiries, not Client Communication
- Sample #4: "Re: Corporate lawyer - your inquiry" → Should be Inquiries

**Root Cause:** Taxonomy lacks distinction between clients and prospects.

**Proposed Fix:**
- Add "Operations - Inquiries" object type
- Define: Communication from non-clients who may become clients
- Map to System Domain: Operations (not Matters)

---

### Pattern 3: Missing "Fulfillment" Category

**Issue:** Client-facing administrative work (accounts, admin) is misclassified as Vendor/Billing.

**Evidence:**
- Sample #9: "Surplus payment for Marcela Hernandez" from Clio → Should be Fulfillment, not Vendor/Billing

**Root Cause:** Clio messages about client matters look like billing but are actually operational.

**Proposed Fix:**
- Add "Operations - Fulfillment" object type
- Define: Admin and accounts work for client matters
- Distinguish from Vendor/Billing (firm's own vendor payments)

---

### Pattern 4: Context-Dependent Routing

**Issue:** Some automated notifications (e.g., Slack) relate to specific client matters and should be routed to Matters, not System Operations.

**Evidence:**
- Sample #6: Slack message about "Legal and Compliance" stream → Marked correct but ML1 notes it could go under "client"

**Root Cause:** Automated sender detection overrides matter-related content signals.

**Proposed Fix:**
- Add secondary content analysis for known systems (Slack, Clio)
- If content references client/matter keywords, elevate to Matters domain

---

## Confidence Calibration Assessment

| Observation | Finding |
|-------------|---------|
| Overconfident predictions | None detected |
| Underconfident predictions | None detected |
| Unknown rate | 0% (may be too low) |

**Recommendation:** Current confidence thresholds are appropriate. Consider lowering the "default to Client Communication" confidence to trigger more "Unknown" classifications.

---

## Proposed Calibration Changes

### 1. Taxonomy Updates (Required)

| Change | Type | Rationale |
|--------|------|-----------|
| Add "Operations - Inquiries" | New object type | Distinguish prospects from clients |
| Add "Operations - Fulfillment" | New object type | Client-facing admin/accounts work |
| Add "Operations" system domain | New domain | Home for operational categories |

### 2. Classifier Rule Changes (Recommended)

| Change | Type | Rationale |
|--------|------|-----------|
| Reduce default fallback confidence | Threshold | Trigger more Unknown classifications |
| Add Clio-specific routing | Pattern | Clio client messages → Fulfillment |
| Add promotional language detection | Pattern | Catch marketing that bypasses Gmail labels |

### 3. No Changes Required

- Confidence thresholds for existing categories
- Legal Matter Email detection
- System Notification detection
- Vendor/Billing detection

---

## Recommendation

**Proceed with taxonomy updates** per Workstream C, then optionally re-pilot to validate.

Given 89% accuracy and ML1's "Proceed" recommendation, the system cognition is acceptable. Taxonomy updates will improve precision for future runs.

---

## Sign-Off

**SYS-008 Knowledge Curation:** Analysis complete
**Date:** 2026-01-29

**Validation Required:**
- [ ] SYS-009 QA review of this memo
- [ ] ML1 approval of proposed changes
