# EU Normalization Rules

Use these rules before committing a European Union row into `data/normalized/eu/tariff-records.json`.

1. Use an official EU source snapshot from the Access2Markets tariff endpoint and record the query in `data/raw/eu/`.
2. Use `DE` as the representative destination member state only because the official endpoint requires a member-state code.
3. Normalize a 6-digit row only when every returned product branch shares the same base customs-duty outcome.
4. Do not treat conditional end-use, airworthiness, quota, or control measures as the base MFN duty unless the product truly depends on that condition.
5. If official EU branches diverge materially, do not guess. Route the lookup into a `needs more detail` state instead.
6. If no verified EU normalized row exists and the case is not branch-ambiguous, any prototype fallback must be labeled explicitly as seed/demo data.
