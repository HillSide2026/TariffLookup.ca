# Skill: Normalized Dataset Maintenance

Purpose:
- Keep `data/normalized/eu/tariff-records.json` truthful, sorted, and synchronized with the normalization pipeline.

Use when:
- adding normalized EU rows
- fixing dataset drift

Required behavior:
- preserve dataset integrity
- sync data changes with normalization logic and tests
- avoid stale or orphaned records

Outputs:
- dataset update
- sync note
- drift correction
