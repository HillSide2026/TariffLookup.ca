---
id: 06_runs__inbox_triage__pilot__pilot-2026-01-29__ml1_review_worksheet_md
title: ML1 Review Worksheet — Stage 2.4 Workstream A
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# ML1 Review Worksheet — Stage 2.4 Workstream A

**Date:** 2026-01-29
**Pilot Run:** pilot-2026-01-29
**Total Messages:** 100
**Sample Size:** 9 (representative across object types and confidence levels)
**Reviewed:** 2026-01-29 by ML1

---

## Instructions

For each sample below, review the classification and mark your assessment:

- **C** = Correct
- **A** = Acceptable but imprecise
- **I** = Incorrect
- **U** = Should have been Unknown

---

## Review Samples

### 1. Client Communication (High Confidence: 0.82)

| Field | Value |
|-------|-------|
| **Subject** | "Missed Call" |
| **Sender** | donotreply.soulpepper.com |
| **Labels** | UNREAD, IMPORTANT, CATEGORY_UPDATES, INBOX |
| Message ID | `19c0709369eddf05` |
| Object Type | Client Communication |
| Lifecycle State | Action Required |
| System Domain | Matters |
| Confidence | 0.82 |
| Reasoning | Default classification - potential client; Contains action language; Client communication maps to Matters |

**ML1 Assessment:** [x] A

**ML1 Notes:** Goes under Inquiries (which is LL jargon for communication from real people who are not clients and don't have a matter but may in the future)

---

### 2. Client Communication (Low Confidence: 0.75)

| Field | Value |
|-------|-------|
| **Subject** | "Save and send money with Canada Post" |
| **Sender** | communications.canadapost-postescanada.ca |
| **Labels** | UNREAD, CATEGORY_UPDATES, INBOX |
| Message ID | `19c054695709fe26` |
| Object Type | Client Communication |
| Lifecycle State | Reference |
| System Domain | Matters |
| Confidence | 0.75 |
| Reasoning | Default classification - potential client; No action indicators; Client communication maps to Matters |

**ML1 Assessment:** [x] I

**ML1 Notes:** Goes under promotion

---

### 3. Legal Matter Email (High Confidence: 0.86)

| Field | Value |
|-------|-------|
| **Subject** | "Re: draft contract" |
| **Sender** | levinelegal.ca |
| **Labels** | SENT |
| Message ID | `19c05d84668d4b8c` |
| Object Type | Legal Matter Email |
| Lifecycle State | Waiting |
| System Domain | Matters |
| Confidence | 0.86 |
| Reasoning | Subject contains legal term; Sender domain suggests legal; Acknowledgment language |

**ML1 Assessment:** [x] C

**ML1 Notes:** —

---

### 4. Legal Matter Email (Low Confidence: 0.74)

| Field | Value |
|-------|-------|
| **Subject** | "Re: Corporate lawyer - your inquiry" |
| **Sender** | levinelegal.ca |
| **Labels** | SENT |
| Message ID | `19c0606031817b9c` |
| Object Type | Legal Matter Email |
| Lifecycle State | Reference |
| System Domain | Matters |
| Confidence | 0.74 |
| Reasoning | Sender domain suggests legal; No action indicators; Legal content maps to Matters |

**ML1 Assessment:** [x] A

**ML1 Notes:** Goes under Inquiries

---

### 5. Marketing (Confidence: 0.76)

| Field | Value |
|-------|-------|
| **Subject** | "Three Weeks to Strengthen Our Village Shul Community" |
| **Sender** | villageshul.com |
| **Labels** | CATEGORY_PROMOTIONS, UNREAD, IMPORTANT, INBOX |
| Message ID | `19c066035f713752` |
| Object Type | Marketing |
| Lifecycle State | Action Required |
| System Domain | Personal Noise |
| Confidence | 0.76 |
| Reasoning | Gmail labeled as promotions; Marked important/starred; Marketing maps to Personal Noise |

**ML1 Assessment:** [x] C

**ML1 Notes:** Goes under promotions

---

### 6. System Notification (High Confidence: 0.80)

| Field | Value |
|-------|-------|
| **Subject** | "Tulika - stream (Legal and Compliance) mentioned everyone in #marketing-materials-approval-" |
| **Sender** | slack.com |
| **Labels** | IMPORTANT, CATEGORY_UPDATES, INBOX |
| Message ID | `19c0562c90dd5d3c` |
| Object Type | System Notification |
| Lifecycle State | Action Required |
| System Domain | System Operations |
| Confidence | 0.80 |
| Reasoning | Sender is automated system; Marked important/starred; System alert maps to Operations |

**ML1 Assessment:** [x] C

**ML1 Notes:** Goes under client because of existence of specific domain ie 'get-stream'

---

### 7. System Notification (Low Confidence: 0.76)

| Field | Value |
|-------|-------|
| **Subject** | "LL Inquiries: New voicemail from +1 647-616-3011" |
| **Sender** | google.com |
| **Labels** | CATEGORY_UPDATES, INBOX |
| Message ID | `19c06db63b87dd9c` |
| Object Type | System Notification |
| Lifecycle State | Reference |
| System Domain | System Operations |
| Confidence | 0.76 |
| Reasoning | Sender is automated system; No action indicators; System alert maps to Operations |

**ML1 Assessment:** [x] C

**ML1 Notes:** Either operations or inquiries

---

### 8. Vendor / Billing (High Confidence: 0.78)

| Field | Value |
|-------|-------|
| **Subject** | "Asana payment confirmation" |
| **Sender** | asana.com |
| **Labels** | UNREAD, IMPORTANT, CATEGORY_UPDATES, INBOX |
| Message ID | `19c067150aeec2c8` |
| Object Type | Vendor / Billing |
| Lifecycle State | Action Required |
| System Domain | Finance |
| Confidence | 0.78 |
| Reasoning | Subject contains billing term; Marked important/starred; Billing maps to Finance |

**ML1 Assessment:** [x] C

**ML1 Notes:** Vendor

---

### 9. Vendor / Billing (Low Confidence: 0.74)

| Field | Value |
|-------|-------|
| **Subject** | "Surplus payment for Marcela Hernandez" |
| **Sender** | clio.com |
| **Labels** | CATEGORY_UPDATES, INBOX |
| Message ID | `19c058dab78ebdf1` |
| Object Type | Vendor / Billing |
| Lifecycle State | Reference |
| System Domain | Finance |
| Confidence | 0.74 |
| Reasoning | Subject contains billing term; No action indicators; Billing maps to Finance |

**ML1 Assessment:** [x] A

**ML1 Notes:** Fulfillment / Operations (client-facing accounts and admin work)

---

## Summary

After reviewing all samples:

| Assessment | Count |
|------------|-------|
| Correct (C) | 5 |
| Acceptable (A) | 3 |
| Incorrect (I) | 1 |
| Should be Unknown (U) | 0 |

**Accuracy Rate:** 89% (C + A)

---

## Overall Observations

**What worked well:**

- Legal Matter Email detection (samples 3, 4)
- Marketing/Promotions detection via Gmail labels (sample 5)
- System Notification detection (samples 6, 7)
- Vendor/Billing detection (sample 8)

**Systematic issues identified:**

1. "Default to Client Communication" fallback is too broad — catches Marketing (sample 2)
2. Missing distinction between Client Communication and **Inquiries** (potential clients)
3. Missing **Operations - Fulfillment** category for client-facing admin/accounts work
4. Some context-dependent routing needed (e.g., Slack messages that relate to specific clients)

**Suggested taxonomy changes:**

1. **Add:** "Operations - Inquiries" — communication from non-clients who may become clients
2. **Add:** "Operations - Fulfillment" — admin and accounts work for client matters
3. **Clarify:** Distinction between "client" (has matter) vs "inquiry" (potential client)

**Confidence calibration notes:**

- Confidence scores seem appropriate — lower confidence items were correctly flagged for review
- No "Should be Unknown" cases — system is not over-confident

---

## ML1 Signature

**Reviewed by:** ML1

**Date:** 2026-01-29

**Recommendation:** [x] Proceed
