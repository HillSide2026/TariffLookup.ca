---
id: 04_initiatives__ll_portfolio__05_matter_docketing__specs__matter_todo_confidence_model_md
title: Matter To-Do Confidence Model
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Matter To-Do Confidence Model

**Status:** NORMATIVE
**Version:** 1.0
**Effective:** 2026-02-04

---

## 1. Purpose

This document defines an actionability-based confidence model for task extraction. Confidence reflects the certainty that a task represents a genuine, actionable obligation—not the certainty of NLP pattern matching.

---

## 2. Confidence Levels

### 2.1 Definitions

| Level | Code | Definition |
|-------|------|------------|
| High | `high` | Clear, unambiguous request with identifiable actor and action |
| Medium | `medium` | Probable request but actor, action, or urgency is partially unclear |
| Low | `low` | Possible task but significant ambiguity; requires human review |

### 2.2 Semantics

- **HIGH:** The task can be acted upon immediately without clarification.
- **MEDIUM:** The task likely requires action but may need verification.
- **LOW:** The task is a candidate for review; may not be actionable.

---

## 3. Scoring Rubric

### 3.1 Checklist Method

Score each criterion as MET (1) or NOT MET (0):

| # | Criterion | Description |
|---|-----------|-------------|
| 1 | **Explicit Request** | Email contains a direct ask using request language (please, can you, need you to) |
| 2 | **Clear Actor** | The person who must act is unambiguously identified (you, lawyer, firm) |
| 3 | **Clear Action** | The required action is specific and identifiable (review, draft, send, call) |
| 4 | **Deadline Present** | An explicit deadline or timeframe is stated |
| 5 | **Not Automated** | Email is from a human, not a system notification |
| 6 | **Not Courtesy** | Email is not primarily a thank-you, acknowledgment, or pleasantry |

### 3.2 Scoring Matrix

| Score | Confidence | Notes |
|-------|------------|-------|
| 5-6 | `high` | Strong actionable signal |
| 3-4 | `medium` | Probable task, some ambiguity |
| 1-2 | `low` | Weak signal, needs review |
| 0 | Disqualified | Should not produce a task |

---

## 4. Hard Rules

These rules MUST be applied and cannot be overridden by score:

### 4.1 Automatic Disqualification (NO_ACTION)

The following MUST be classified as `NO_ACTION` and MUST NOT produce tasks:

- System notifications (WordPress, calendar, automated alerts)
- Emails containing "no further action needed" or equivalent
- Marketing, newsletters, promotional content
- Password resets, verification codes, MFA prompts
- Subscription confirmations or cancellations

### 4.2 Confidence Ceiling Rules

| Condition | Maximum Confidence |
|-----------|-------------------|
| Source is system notification | Disqualified |
| Contains "no action needed" | Disqualified |
| "See attached" without explicit ask | `medium` |
| Actor (who must act) is unclear | `medium` |
| Pure courtesy message (thanks/acknowledgment) | Disqualified |
| Request is hypothetical or conditional | `medium` |
| Sender is committing to future action | Reclassify to `WAITING_ON_OTHER` |

### 4.3 Mandatory Downgrades

| Condition | Action |
|-----------|--------|
| Email is purely informational | Classify as `INFO_ONLY`, no task |
| Sender states they will do something | Classify as `WAITING_ON_OTHER`, no task |
| Email is automated notification | Classify as `NO_ACTION`, no task |
| "Thank you" or "Got it" without embedded ask | Classify as `INFO_ONLY`, no task |

---

## 5. Pattern Examples

### 5.1 HIGH Confidence Patterns

These patterns, when present, support `high` confidence:

```
"Please review the attached agreement and advise by Friday"
"Can you send me the signed documents today"
"I need you to file the notice of change before the deadline"
"Kindly provide your comments on the draft by EOD"
```

Characteristics:
- Direct request verb (please review, can you send, need you to)
- Specific action (review, send, file, provide)
- Clear actor (you/lawyer implied)
- Often includes deadline

### 5.2 MEDIUM Confidence Patterns

These patterns support `medium` confidence:

```
"See attached for your review"
"Let me know if you have any questions"
"Following up on my previous email"
"Any updates on this matter?"
```

Characteristics:
- Implicit request (review implied, not stated)
- Action is vague (let me know, any updates)
- Actor may be unclear
- No deadline specified

### 5.3 LOW Confidence Patterns

These patterns support `low` confidence:

```
"FYI - here's the latest version"
"Just wanted to share this with you"
"Thought you might find this interesting"
```

Characteristics:
- Informational framing (FYI, sharing)
- No explicit request
- No action implied
- Likely should be `INFO_ONLY`

### 5.4 Disqualified Patterns

These patterns MUST NOT produce tasks:

```
"No further action is needed on your part"
"Your site has been updated to WordPress 6.9"
"Thank you for your help!"
"Got it, thanks!"
"This is an automated notification"
```

Characteristics:
- Explicit no-action statement
- Automated source
- Pure courtesy/acknowledgment

---

## 6. Classification Downgrade Guidance

### 6.1 Downgrade to INFO_ONLY

Reclassify to `INFO_ONLY` when:

- Email is forwarded FYI with no accompanying ask
- Email is a status update with no request
- Email is sharing information "for your records"
- Email is confirming receipt without requesting anything
- Email is a courtesy reply (thanks, got it, noted)

### 6.2 Downgrade to WAITING_ON_OTHER

Reclassify to `WAITING_ON_OTHER` when:

- Sender states "I will send you..." or "I'll follow up..."
- Sender states "We are waiting on [third party]..."
- Sender indicates they are taking an action
- Email indicates a pending external dependency

### 6.3 Downgrade to NO_ACTION

Reclassify to `NO_ACTION` when:

- Email matches automated notification patterns
- Email is from a known system sender domain
- Email contains unsubscribe link and marketing content
- Email is a calendar invite or update
- Email is a password/MFA notification

---

## 7. Implementation Notes

### 7.1 Order of Evaluation

1. Apply Hard Rules (Section 4) first
2. If not disqualified, apply Scoring Rubric (Section 3)
3. Apply Confidence Ceiling Rules
4. Apply Downgrade Guidance if applicable

### 7.2 Tie-Breaking

When signals conflict:

- Disqualification rules take precedence over scoring
- Ceiling rules take precedence over raw score
- When in doubt, use the lower confidence level

### 7.3 Audit Trail

For each task, the system SHOULD record:

- Which criteria were met/unmet
- Which hard rules were evaluated
- Final confidence with rationale

---

## 8. Reference

This model is referenced by:
- `MATTER_TODO_REPORT.md` — Section 4 (Task Generation)
- `MATTER_TODO_OUTPUT_SCHEMA.md` — `task.confidence` field

Confidence values MUST be one of: `high`, `medium`, `low` (lowercase).
