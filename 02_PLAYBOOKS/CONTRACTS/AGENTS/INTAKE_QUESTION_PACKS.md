---
id: 02_playbooks__contracts__agents__intake_question_packs_md
title: Intake Question Packs — Contracts
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Intake Question Packs — Contracts

Minimum viable fact sets per Solution. Asked in fixed order when confidence is LOW or assumption budget exceeded.

---

## VENDOR_AGREEMENT

### Pack: VENDOR-CORE

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | What goods or services are being procured? | Scope definition |
| 2 | Who is the counterparty (vendor)? | Risk assessment |
| 3 | What is the approximate contract value? | Standard vs bespoke |
| 4 | Is this a one-time purchase or ongoing relationship? | D02_RELATIONSHIP_TYPE |
| 5 | Does the vendor's standard terms govern, or are we drafting? | Negotiation posture |
| 6 | Are there IP or data implications? | Licensing overlay |
| 7 | What is the desired governing law? | D03_GOVERNING_LAW |
| 8 | Any regulatory requirements? | Regulatory surface |

---

## CUSTOMER_AGREEMENT

### Pack: CUST-CORE

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | What goods or services is our client providing? | Scope definition |
| 2 | Who is the customer? | Risk assessment |
| 3 | What is the approximate contract value? | Standard vs bespoke |
| 4 | Is this a one-time delivery or ongoing relationship? | D02_RELATIONSHIP_TYPE |
| 5 | Are we drafting or reviewing the customer's form? | Negotiation posture |
| 6 | Does our client retain IP in the deliverables? | IP protection |
| 7 | What liability position does our client want? | Risk allocation |
| 8 | Any regulatory requirements (consumer protection, etc.)? | Regulatory surface |

---

## SERVICE_AGREEMENT

### Pack: SVC-TYPE (MSA vs SOW Selection)

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | Is this a single engagement or an ongoing relationship with multiple projects? | MSA vs standalone |
| 2 | Will there be multiple deliverables or phases over time? | SOW structure |
| 3 | Does the client want a framework agreement? | MSA indicator |

### Pack: SVC-CORE

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | What services are being provided? | Scope |
| 2 | Who is providing and who is receiving? | D01_CLIENT_POSITION |
| 3 | What are the performance standards (if any)? | SLA inclusion |
| 4 | What is the intended term? | Duration and renewal |
| 5 | What termination rights are important? | Exit flexibility |
| 6 | Are there data handling or privacy requirements? | Regulatory surface |

---

## NDA_CONFIDENTIALITY

### Pack: NDA-CORE

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | Is confidentiality mutual or one-way? | NDA type |
| 2 | What is the purpose of the disclosure? | Scope limitation |
| 3 | What type of information is being shared? | Definition of confidential information |
| 4 | What is the desired duration of confidentiality? | Term |
| 5 | Is this a precursor to a substantive agreement? | Collision matrix |

---

## LICENSING

### Pack: LIC-CORE

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | What is being licensed (software, IP, data, content)? | License type |
| 2 | Is our client the licensor or licensee? | D01_CLIENT_POSITION |
| 3 | What scope of use is intended? | License grant |
| 4 | Is the license exclusive or non-exclusive? | Exclusivity |
| 5 | What is the term and territory? | Scope limitation |
| 6 | Are there sublicensing rights? | Downstream use |
| 7 | What happens to the license on termination? | Exit mechanics |

---

## INTERCOMPANY

### Pack: INTER-CORE

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | What is the relationship between the entities? | Related-party context |
| 2 | What is the nature of the transaction? | Solution sub-type |
| 3 | Are there transfer pricing considerations? | Tax escalation |
| 4 | Is this driven by regulatory, tax, or operational reasons? | Purpose |
| 5 | Does this need to be arm's-length in substance? | Structure |

---

## Question Sequencing Rules

1. Ask questions in the order listed
2. If an answer triggers an escalation, stop and escalate
3. If an answer clarifies a decision point, update confidence
4. Do not assume answers; do not skip questions
