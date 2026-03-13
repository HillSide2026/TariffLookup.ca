---
id: 02_playbooks__corporate__agents__intake_question_packs_md
title: Intake Question Packs
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Intake Question Packs

Minimum viable fact sets per Solution. Asked in fixed order when confidence is LOW or assumption budget exceeded.

---

## Purpose

Structured questions ensure the Agent gathers necessary facts before proceeding. Questions are asked in a fixed order per Solution to ensure consistency and completeness.

---

## When to Use

- Agent confidence is LOW (<0.65) on any C1–C4 decision
- Assumption budget exceeded (>3 assumptions)
- Escalation trigger requires fact clarification

---

## INCORPORATION

### Pack: INC-CORE

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | What is the preferred jurisdiction: Ontario (OBCA) or Federal (CBCA)? | D01_STATUTE_SELECTION |
| 2 | Named corporation or numbered? | Filing path, NUANS requirement |
| 3 | If named, what is the proposed corporate name? | Name search, availability |
| 4 | Who are the founding shareholders and their ownership percentages? | Share allocation, governance |
| 5 | Who will be the initial directors? Are they Canadian residents? | Director requirements |
| 6 | Who will be the initial officers (President, Secretary, Treasurer)? | Organizational resolutions |
| 7 | What is the registered office address? | Statutory requirement |
| 8 | What share structure is needed? (Single class common / multiple classes) | Articles content |
| 9 | Is financing anticipated in the near term? | Share structure planning |
| 10 | Is a shareholder agreement anticipated? | Solution sequencing |

---

## SHAREHOLDER_AGREEMENT

### Pack: SHA-TYPE (SA vs USA Selection)

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | Do shareholders intend to manage the corporation directly (without a board), or should directors manage? | D03_AGREEMENT_TYPE |
| 2 | Should shareholders be able to restrict or override board decisions? | SA vs USA indicator |
| 3 | Are shareholders willing to assume personal liability for management decisions? | USA consequence |
| 4 | Will all shareholders and all share classes be parties to the agreement? | USA requirement |

### Pack: SHA-CORE (After type determined)

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | How many shareholders will be parties? | Governance structure |
| 2 | What are the ownership percentages? | Control allocation |
| 3 | Are shareholders also operators/employees? | Non-compete, active role |
| 4 | What transfer restrictions are desired? (Consent, ROFR, lock-up) | D07_TRANSFER_RESTRICTIONS |
| 5 | What exit mechanisms should be included? (Tag-along, drag-along, shotgun, put/call) | D06_EXIT_MECHANISM |
| 6 | How should deadlock be resolved? | Deadlock module selection |
| 7 | Are there specific reserved matters requiring unanimous or supermajority consent? | Governance schedule |
| 8 | Is there an anticipated exit horizon or liquidity event? | Exit planning |

---

## SHAREHOLDER_CHANGE

### Pack: SHC-CORE

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | Is this a new shareholder entering, existing shareholder exiting, or reallocation among existing? | Transaction type |
| 2 | What is the current share structure? | Baseline |
| 3 | What is the proposed change? (Shares transferred, issued, redeemed) | Mechanics |
| 4 | Is there an existing shareholder agreement? | Governing provisions |
| 5 | If SA exists, does it require consent or ROFR for this transaction? | Compliance |
| 6 | What consideration is being paid? (Cash, property, services) | Tax implications |
| 7 | Are there any related party considerations? | Conflict of interest |
| 8 | Will the governance structure change as a result? | Downstream effects |

---

## SHAREHOLDER_CONFLICT

### Pack: SHF-CORE

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | What is the nature of the dispute? (Deadlock, oppression, breach of agreement) | Classification |
| 2 | Who are the disputing parties? | Positions |
| 3 | Is there an existing SA/USA with dispute resolution provisions? | Contractual remedies |
| 4 | Has any notice been given or formal process initiated? | Procedural status |
| 5 | What outcome does the client seek? (Resolution, buyout, wind-up) | Objective |
| 6 | Are there immediate time pressures? (Board meeting, financing, regulatory) | Urgency |
| 7 | Is litigation or oppression remedy being considered? | Escalation path |

---

## BUSINESS_ACQUISITION

### Pack: ACQ-CORE

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | Is this an asset purchase or share purchase? | Structure |
| 2 | Who is the acquirer? (Existing entity, new entity, individual) | Vehicle |
| 3 | Who is the target/vendor? | Counterparty |
| 4 | What is being acquired? (100% shares, partial interest, specific assets) | Scope |
| 5 | Is there an existing LOI or term sheet? | Stage |
| 6 | What is the anticipated consideration? (Cash, shares, earnout) | Economics |
| 7 | Are there regulatory approvals required? | Compliance |
| 8 | Is post-closing governance contemplated? (SA, employment, transition) | Solution sequencing |

---

## CORPORATE_ADVISORY

### Pack: ADV-CORE

| # | Question | Why It Matters |
|---|----------|----------------|
| 1 | What is the specific question or issue? | Scope |
| 2 | Is this related to an existing matter or new? | Context |
| 3 | What is the time sensitivity? | Priority |
| 4 | Are there any pending corporate actions (meeting, resolution, filing)? | Urgency |
| 5 | Does this potentially trigger a transactional Solution? | Classification |

---

## Question Sequencing Rules

1. Ask questions in the order listed
2. If an answer triggers an escalation, stop and escalate
3. If an answer clarifies a decision point, update confidence
4. Proceed to next question only after answer received
5. Do not assume answers; do not skip questions

---

## Partial Intake

If client provides partial information:
- Ask only the unanswered questions
- Note which questions were pre-answered
- Do not re-ask answered questions

---

## Updating Question Packs

New questions may be added when:
1. A recurring information gap is identified
2. A new decision point requires specific facts
3. Escalation patterns suggest missing intake data

Updates require ML1 approval.
