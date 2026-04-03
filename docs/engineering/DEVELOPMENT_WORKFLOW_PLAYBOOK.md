# Development Workflow Playbook

Last updated: 2026-04-03  
Owner: ML1

## Purpose

This note captures the workflow changes that materially increased development speed during the EU coverage push.

It is meant to preserve what worked so the team can repeat it, tighten it, and improve it incrementally instead of rediscovering the pattern each time.

## What Increased Speed

The speed increase did not come from one bigger agent. It came from a tighter system:

- one clear numeric target with a short time horizon
- parallel specialized agents with narrow scopes
- direct-HS-first normalization to avoid premature classifier work
- machine-readable batch manifests and codes files
- immediate repair of workflow bottlenecks when they appeared
- explicit state tracking: `normalized`, `blocked_with_guidance`, `manual_review`, `in_queue`
- fast verification and documentation sync after each wave

## What We Actually Did

During the 2026-04-03 overnight EU push, throughput improved because we split the work into separate lanes:

1. A planning lane selected the next batch and fixed the batch-selection script when the ESM path bug appeared.
2. A risk-analysis lane identified where description-first classifier work was safe and where it should stay direct-HS-only.
3. An intake lane pulled official Access2Markets payloads and ran normalization.
4. The main integration lane merged safe results, patched the normalization writer to preserve live-only rows, updated catalog state, and kept tests and docs in sync.

That pattern reduced context switching and prevented one lane from blocking the others.

## Why It Worked

- Specialized agents were easier to direct than one general-purpose backend worker.
- Direct-HS-first intake avoided getting stuck on ambiguous classifier design.
- Batch manifests made the work concrete, reviewable, and resumable.
- Explicit state buckets let us capture progress without forcing unsafe normalization.
- Fixing tooling bottlenecks immediately prevented repeated drag in later batches.
- Verification happened close to the change, while context was still fresh.

## Recommendation On A Master Backend Builder Agent

Default answer: no.

A single master backend builder agent is likely to become a bottleneck because it mixes planning, execution, verification, and integration into one wide write scope. That usually hurts parallelism, increases merge risk, and makes it harder to tell whether a slowdown comes from bad decomposition or bad implementation.

What is useful instead:

- one orchestrator or integrator lane that owns sequencing, final integration, and quality gates
- a small set of specialized worker patterns with narrow ownership

Good standard worker roles for this repo:

- `batch-planner`: chooses the next HS-code slate and writes manifests
- `risk-analyst`: decides direct-HS-only versus classifier-safe candidates
- `intake-worker`: captures raw Access2Markets payloads and updates manifests
- `normalization-worker`: runs normalization and prepares safe rows
- `classifier-promoter`: adds description-first rules only for already-proven safe codes
- `docs-syncer`: updates queue, coverage, and roadmap docs after data changes

Reusable prompt templates for those roles now live in `docs/engineering/WORKER_PROMPT_TEMPLATES.md`.

If a broader backend role is needed, it should be an integrator role, not a master builder role.

## Standard Workflow To Reuse

1. Define one numeric target.
2. Pick a narrow batch with a written manifest.
3. Split work into planning, risk, intake, integration, and docs lanes.
4. Keep file ownership narrow for each worker.
5. Normalize direct HS support first.
6. Promote description-first classifier coverage only when the code is stable and specific enough to be safe.
7. Preserve explicit blocked and manual-review states instead of forcing coverage.
8. Run verification immediately after each write wave.
9. Regenerate coverage docs from the catalog before starting the next wave.

Current command:

- `npm --prefix backend run generate:eu-docs`

## Standardization Backlog

The next improvements should be small, reusable, and compounding:

- Add a batch lifecycle convention such as `defined -> captured -> normalized -> written -> verified`.
- Teach the catalog to track the active batch more explicitly once a captured batch has already been applied.
- Add a lightweight changed-code smoke test that checks every newly normalized HS code by direct lookup.
- Add a classifier-promotion checklist so description-first rules only land when they meet the same safety bar every time.
- Add a short handoff template for agents: goal, write scope, do-not-touch files, verification command, and expected artifact paths.
- Track simple workflow metrics per batch: codes attempted, normalized, manual review, blocked, verification status, and elapsed time.

## Incremental Improvement Rule

Do not redesign the whole workflow after each win.

Keep the loop simple:

1. preserve what worked
2. remove one bottleneck
3. standardize one repeated step
4. measure whether the next batch got easier

That is the fastest path to a durable development system for this repo.
