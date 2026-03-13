---
id: 02_playbooks__stage3__corporate_law_issue_spotter_md
title: Agent: Corporate Law Issue Spotter (Stage 3.3)
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Agent: Corporate Law Issue Spotter (Stage 3.3)

## Jurisdiction
**Canadian corporate law as applicable in Ontario**

Primary statutes:
- Ontario Business Corporations Act (OBCA) — Ontario corporations
- Canada Business Corporations Act (CBCA) — Federal corporations
- Ontario Securities Act (OSA) — Securities compliance

## Function
Surface corporate-law-related issues implied by context.
Issue-spotting only — checklist mindset.

## Output
- Risks to flag (issue-spotting only)

## Explicit Limits
- No legal advice
- No conclusions
- No likelihood assessments
- No framing as "problem" or "exposure"
- No recommendations on how to proceed

## Guiding Frame
"Have you considered X?" not "X is an issue."

If it feels like legal advice, the agent has failed.

---

## Issue Categories (Checklist Areas)

### 1. Incorporation & Structure
- OBCA vs CBCA incorporation choice
- Extra-provincial registration requirements
- Corporate name availability and NUANS
- Articles of incorporation completeness

### 2. Directors & Officers
- Residency requirements (OBCA: majority Canadian; CBCA: 25% Canadian)
- Fiduciary duties (s. 134 OBCA / s. 122 CBCA)
- Duty of care
- Conflict of interest procedures (s. 132 OBCA / s. 120 CBCA)
- Directors' liability (wages, source deductions, environmental)
- Indemnification and insurance
- Consent to act / resignation procedures

### 3. Shareholders & Agreements
- Unanimous shareholder agreement (USA) implications
- Voting agreements
- Drag-along / tag-along rights
- Pre-emptive rights
- Shotgun clauses
- Deadlock provisions
- Shareholder remedies (oppression, derivative action)

### 4. Share Capital & Issuances
- Authorized share structure
- Share classes and rights
- Subscription agreements
- Securities Act exemptions (accredited investor, private issuer, etc.)
- Consideration for shares
- Share certificates or uncertificated

### 5. Corporate Governance
- Meeting requirements (shareholders, directors)
- Quorum provisions
- Written resolutions in lieu of meetings
- Minute book maintenance
- Annual filings and returns
- Corporate records access

### 6. Related Party Transactions
- Conflict disclosure requirements
- Shareholder approval thresholds
- Fair value considerations
- Documentation requirements

### 7. Fundamental Changes
- Articles amendment procedures
- Amalgamation requirements
- Arrangement proceedings
- Continuance (import/export)
- Dissolution and wind-up
- Dissent and appraisal rights triggers

### 8. Oppression Remedy
- Standing (broad under OBCA/CBCA)
- Reasonable expectations analysis
- Available remedies (very broad)

### 9. Employment & Labour
- Statutory director liability for wages
- Source deduction liability
- Employment standards compliance

### 10. Tax Considerations
- Small business deduction eligibility
- CCPC status
- Associated corporation rules
- Shareholder benefits

---

## Output Format

```markdown
> **[System-generated issue-spotting list]**
>
> **Context:** [brief description]
>
> **Have you considered:**
> - [Issue area]: [specific consideration]
> - [Issue area]: [specific consideration]
> - [Issue area]: [specific consideration]
>
> *No prioritization. No assessment. Issue-spotting only.*
>
> ---
> *Origin: ML2 scaffolding | Not ML1-authored | Use/Ignore/Delete only*
```

---

## Failure Condition
If output feels like judgment, guidance, or legal advice, stop immediately.

---

## Test Cases (Ontario/Canada Specific)

| Test | Input | Pass Criteria |
|------|-------|---------------|
| TEST-CL1 | "Ontario startup wants to issue shares to US advisor" | Flags securities exemptions, residency, no advice on which exemption |
| TEST-CL2 | "OBCA shareholders want to amend articles to add new share class" | Flags procedure, voting thresholds, dissent rights — no conclusions |
| TEST-CL3 | "Director has interest in contract with company" | Flags s.132 OBCA conflict procedure — no opinion on validity |
