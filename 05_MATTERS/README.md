---
id: MATTERS-README

title: 05_MATTERS
owner: ML1
status: draft
created_date: 2026-01-30
last_updated: 2026-01-30
tags: [matter]
---

# 05_MATTERS

## Purpose

This directory contains matter-level information organized by **Delivery Status** (lawyer attention priority).

Folder placement reflects `delivery_status` only. The other two fields (`status`, `fulfillment_status`) are metadata stored in each matter's `MATTER.yaml`.

---

## Directory Structure

```
05_MATTERS/
├── ESSENTIAL/   # Highest lawyer attention
├── STRATEGIC/   # Strategic importance
├── STANDARD/    # Normal priority
└── PARKED/      # Temporarily deprioritized
```

---

## ESSENTIAL

| matter_id | matter_name | status | delivery_status | fulfillment_status | path |
|-----------|-------------|--------|-----------------|-------------------|------|
| 25-927-00003 | Stream Ventures Limited | Open | Essential | urgent | `ESSENTIAL/25-927-00003/` |
| 25-1593-00001 | 1001162998 Ontario Corp. o/a KaleMart | Open | Essential | active | `ESSENTIAL/25-1593-00001/` |

---

## STRATEGIC

| matter_id | matter_name | status | delivery_status | fulfillment_status | path |
|-----------|-------------|--------|-----------------|-------------------|------|
| 24-256-00001 | Aspire Infusions Inc | Open | Strategic | active | `STRATEGIC/24-256-00001/` |
| 24-336-00004 | Mascore Helical Piles | Open | Strategic | active | `STRATEGIC/24-336-00004/` |
| 25-1231-00001 | Charmaine Spiteri | Open | Strategic | active | `STRATEGIC/25-1231-00001/` |
| 25-1318-00001 | Zelko Culibrk | Open | Strategic | active | `STRATEGIC/25-1318-00001/` |

---

## STANDARD

| matter_id | matter_name | status | delivery_status | fulfillment_status | path |
|-----------|-------------|--------|-----------------|-------------------|------|
| 22-194-00006 | Rousseau Mazzuca LLP | Open | Standard | active | `STANDARD/22-194-00006/` |
| 23-194-00013 | Rousseau Mazzuca LLP | Open | Standard | active | `STANDARD/23-194-00013/` |
| 23-235-00001 | Baobab Energy Africa Ltd | Open | Standard | active | `STANDARD/23-235-00001/` |
| 24-194-00059 | RM Carpenters training center | Open | Standard | active | `STANDARD/24-194-00059/` |
| 24-845-00001 | STAR 333 SPORTS INC. | Open | Standard | active | `STANDARD/24-845-00001/` |
| 25-1185-00001 | Alexander Klys | Open | Standard | active | `STANDARD/25-1185-00001/` |
| 25-1363-00001 | Raevan Joy Sambrano | Open | Standard | active | `STANDARD/25-1363-00001/` |
| 25-1525-00001 | Kleenup Cleaning Services Inc. | Open | Standard | active | `STANDARD/25-1525-00001/` |
| 25-1538-00002 | Georgiana Nicoară | Open | Standard | active | `STANDARD/25-1538-00002/` |
| 25-845-00002 | STAR 333 SPORTS INC. | Open | Standard | active | `STANDARD/25-845-00002/` |

---

## PARKED

| matter_id | matter_name | status | delivery_status | fulfillment_status | path |
|-----------|-------------|--------|-----------------|-------------------|------|
| 26-1630-00001 | Marcela Hernandez | Open | Parked | keep in view | `PARKED/26-1630-00001/` |
| 23-169-00003 | Best Bottles Inc. | Open | Parked | active | `PARKED/23-169-00003/` |
| 25-822-00001 | Majid Hajibeigy | Open | Parked | active | `PARKED/25-822-00001/` |
| 25-1024-00001 | AllPro Construction Group | Open | Parked | active | `PARKED/25-1024-00001/` |
| 25-1192-00001 | The Knot Churros International Limited | Open | Parked | active | `PARKED/25-1192-00001/` |

---

## Field Model

| Field | Storage | Source | Values |
|-------|---------|--------|--------|
| `status` | Metadata | Clio | Open \| Pending \| Closed |
| `delivery_status` | Directory | ML1 | Essential \| Strategic \| Standard \| Parked |
| `fulfillment_status` | Metadata | Admin | urgent \| active \| keep in view \| dormant |

**Non-inference rule:** Do not infer any field from any other.
