# 0004: DB Schema Remediation Decision

## Status

Accepted

## Context

The application runtime currently targets the Drizzle schema `afenda`.

The documented DB remediation followup records that the verified live Neon branch had legacy schemas named `drizzle` and `saas_template`, while runtime code points to `afenda`. It also records that the baseline migration was rewritten from `saas_template` to `afenda`, which means databases that already recorded the original baseline will not replay the rewritten baseline automatically.

This decision record defines the governed path before any live database mutation is allowed.

## Problem Statement

The project needs one canonical runtime schema and one safe remediation strategy.

The open questions are:

- whether runtime should remain on `afenda` or revert to `saas_template`
- whether migration history should be corrected by rewriting old migrations or by forward-only changes
- how to treat legacy schemas that may still exist in live databases
- what gate is required before any live Neon remediation

## Decision

Keep `afenda` as the canonical runtime schema.

Use forward-only remediation for all DB fixes.

Do not further rewrite baseline migrations or retroactively edit applied migrations.

Accept the rewritten baseline as a historical incident. Do not attempt to fix history by editing already-applied migration files.

Treat `saas_template` as deprecated and not runtime-owned.

Treat `drizzle` as tool/internal metadata, not business schema.

Do not drop legacy schemas until a later approved cleanup verifies contents, dependencies, Drizzle migration records, rollback path, and owner approval.

## Rejected Alternatives

Reverting runtime schema to `saas_template` is rejected because it would reintroduce template-era naming into the active runtime path and broaden cross-layer inconsistency.

Rewriting additional migration history is rejected because applied migrations must be durable records. Existing databases do not replay rewritten migrations, so history edits create divergence instead of remediation.

Dropping legacy schemas immediately is rejected because their contents and dependencies must be verified before destructive cleanup.

Using `db:push` for remediation is rejected because it bypasses the governed forward-only migration path.

## Consequences

- Runtime ownership is clear: `afenda` is canonical.
- Future DB remediation must be expressed as new migration work, not history edits.
- Existing legacy schemas are cleanup candidates, not immediate deletion targets.
- Live remediation remains blocked until the execution gate in `ATC-0009` is satisfied.
- Repo validation can pass while live Neon compatibility still requires a separately approved DB remediation PR.

## Required Safeguards

Before any live DB remediation:

- identify the target Neon project, branch, database, and connection role
- create a branch, backup, snapshot, or equivalent restore point
- review schema diff against the target branch
- prepare a forward-only migration and data movement plan
- document rollback strategy and verification queries
- record explicit project-owner approval
- do not use `db:push`
