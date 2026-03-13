---
id: 02_playbooks__corporate__agents__solution_collision_matrix_md
title: Solution Collision Matrix
owner: ML1
status: draft
created_date: 2026-02-08
last_updated: 2026-02-08
tags: []
---

# Solution Collision Matrix

Routing logic when multiple Solutions apply to a single matter.

---

## Purpose

Real matters often hit multiple Solutions. This matrix makes routing explicit to prevent the Agent from inventing sequencing logic.

---

## How to Use

1. Identify all potentially applicable Solutions
2. Check the matrix for the relevant pair
3. Follow the routing guidance
4. Note common traps
5. Escalate if indicated

---

## Matrix

### INCORPORATION × SHAREHOLDER_AGREEMENT

| Field | Guidance |
|-------|----------|
| **Sequence** | INCORPORATION → SHAREHOLDER_AGREEMENT |
| **Rationale** | Corporation must exist before shareholders can contract |
| **Common pattern** | SA/USA prepared in parallel, executed after incorporation |
| **Common traps** | USA drafted before Articles finalized; inconsistency results |
| **When to escalate** | USA terms require specific Articles provisions |

---

### INCORPORATION × SHAREHOLDER_CHANGE

| Field | Guidance |
|-------|----------|
| **Sequence** | INCORPORATION → SHAREHOLDER_CHANGE |
| **Rationale** | Initial issuance is part of incorporation; subsequent changes are separate |
| **Common pattern** | Founders incorporated, then bring in new shareholders |
| **Common traps** | Treating initial issuance as "shareholder change" |
| **When to escalate** | Financing planned immediately post-incorporation |

---

### SHAREHOLDER_AGREEMENT × SHAREHOLDER_CHANGE

| Field | Guidance |
|-------|----------|
| **Sequence** | Depends on facts |
| **Rationale** | Change may trigger SA amendment; or SA may govern the change |
| **Common pattern** | SA provisions control how change occurs |
| **Common traps** | Ignoring existing SA transfer restrictions |
| **When to escalate** | SA requires consent; consent not obtained |

---

### SHAREHOLDER_CHANGE × SHAREHOLDER_CONFLICT

| Field | Guidance |
|-------|----------|
| **Sequence** | CONFLICT often arises FROM CHANGE |
| **Rationale** | Disputes frequently triggered by ownership shifts |
| **Common pattern** | Minority squeeze-out; control shift without process |
| **Common traps** | Treating as simple change when conflict indicators exist |
| **When to escalate** | Any indication of disputed transaction; oppression risk |

---

### BUSINESS_ACQUISITION × INCORPORATION

| Field | Guidance |
|-------|----------|
| **Sequence** | INCORPORATION → ACQUISITION (if new entity acquiring) |
| **Rationale** | Acquisition vehicle must exist before transaction |
| **Common pattern** | NewCo incorporated to acquire target |
| **Common traps** | Signing acquisition docs before incorporation complete |
| **When to escalate** | Complex acquisition structure; tax-driven entity selection |

---

### BUSINESS_ACQUISITION × SHAREHOLDER_AGREEMENT

| Field | Guidance |
|-------|----------|
| **Sequence** | PARALLEL or SA post-closing |
| **Rationale** | Acquisition may require SA among new ownership group |
| **Common pattern** | Joint venture acquisition; SA governs JV relationship |
| **Common traps** | SA negotiated separately from acquisition; terms conflict |
| **When to escalate** | SA provisions affect acquisition economics or control |

---

### BUSINESS_ACQUISITION × SHAREHOLDER_CHANGE

| Field | Guidance |
|-------|----------|
| **Sequence** | ACQUISITION encompasses CHANGE |
| **Rationale** | Share acquisition is a form of shareholder change |
| **Common pattern** | Target shareholders exit; acquirer enters |
| **Common traps** | Forgetting pre-existing SA provisions |
| **When to escalate** | Partial acquisition; some shareholders remain |

---

### CORPORATE_ADVISORY × [Any Solution]

| Field | Guidance |
|-------|----------|
| **Sequence** | ADVISORY may precede, accompany, or follow any Solution |
| **Rationale** | Advisory is ongoing; other Solutions are transactional |
| **Common pattern** | Advisory engagement reveals need for specific Solution |
| **Common traps** | Advisory scope creep into transaction without proper Solution framing |
| **When to escalate** | Advisory matter reveals conflict or structural issue |

---

### SHAREHOLDER_CONFLICT × SHAREHOLDER_AGREEMENT

| Field | Guidance |
|-------|----------|
| **Sequence** | AGREEMENT terms may define CONFLICT resolution |
| **Rationale** | SA/USA often contains dispute resolution provisions |
| **Common pattern** | Mediation/arbitration clause invoked |
| **Common traps** | Ignoring contractual remedies; jumping to statutory oppression |
| **When to escalate** | SA remedies inadequate; statutory remedy may be needed |

---

## Three-Way Collisions

### INCORPORATION × SHAREHOLDER_AGREEMENT × SHAREHOLDER_CHANGE

| Field | Guidance |
|-------|----------|
| **Sequence** | INCORPORATION → SA → CHANGE |
| **Common pattern** | Founders incorporate, sign SA, then bring in investors |
| **Trap** | SA not drafted to accommodate anticipated change |
| **Escalate** | When investor terms may require SA amendment |

### BUSINESS_ACQUISITION × SHAREHOLDER_AGREEMENT × SHAREHOLDER_CONFLICT

| Field | Guidance |
|-------|----------|
| **Sequence** | CONFLICT may block ACQUISITION; SA governs resolution |
| **Common pattern** | Minority holdout on sale; drag-along invoked |
| **Trap** | Proceeding with acquisition despite unresolved conflict |
| **Escalate** | Any indication of shareholder dispute affecting transaction |

---

## Collision Detection Checklist

Before proceeding with any Solution, verify:

| Check | Question |
|-------|----------|
| ☐ | Are there other potentially applicable Solutions? |
| ☐ | Is there an existing SA/USA that governs this matter? |
| ☐ | Does the transaction sequence create dependencies? |
| ☐ | Are there conflict indicators? |
| ☐ | Does the matrix indicate escalation? |

---

## Adding Collision Pairs

New pairs may be added when:
1. A recurring multi-solution pattern is identified
2. Common traps are discovered
3. Escalation guidance would reduce risk

Updates require ML1 approval.
