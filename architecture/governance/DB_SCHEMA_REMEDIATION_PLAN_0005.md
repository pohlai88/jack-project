# DB Schema Remediation Plan 0005

Date: 2026-04-26

## Status

Planned only. No live Neon state, DB schema, migration, or seed files are changed by PR 5.

## Current Finding

The runtime Drizzle schema target is `afenda`.

The verified live Neon branch reported legacy/deprecated schemas:

- `drizzle`
- `saas_template`

The baseline migration history has a known issue: the original baseline was rewritten from `saas_template` to `afenda`. Databases that have already recorded the original baseline will not replay the rewritten migration automatically.

## Remediation Policy

Do not silently rewrite existing migrations.

Do not run live DB changes without explicit approval.

Do not use `db:push` for this remediation path.

Required before any live mutation:

- Confirm target Neon project, branch, database, and connection role.
- Create a Neon branch, backup, or equivalent restore point.
- Verify existing schemas, tables, row counts, extensions, and Drizzle migration records.
- Choose the approved runtime schema target.
- Produce a forward-only migration and data movement plan if `afenda` remains the runtime schema.
- Validate the migration plan against a disposable branch before production-like environments.

## Recommended Forward Path

Keep PR 5 documentation-only for DB remediation.

For a later approved DB remediation PR:

1. Inspect live branch state without mutation.
2. Create a safety branch or backup.
3. Apply ADR 0004: runtime remains `afenda`.
4. If runtime remains `afenda`, create a forward-only corrective migration plan that creates or renames schema objects and moves data safely.
5. Validate on an isolated branch.
6. Apply only after explicit approval.

## Rollback And Backup Expectations

Any future live remediation must have a rollback path before execution.

Minimum expectation:

- a Neon branch or restore point exists before mutation
- migration SQL and data movement steps are reviewed
- verification queries are prepared before apply
- rollback criteria are defined before apply

## Validation Commands

These commands validate repo health only. They do not prove live Neon compatibility.

```bash
pnpm doctrine:check
pnpm repo:guard
pnpm lint
pnpm type-check
pnpm test
pnpm build
git diff --check
```

## Ownership And Approval

Live DB remediation requires explicit project-owner approval.

Until approved, the DB schema mismatch and rewritten baseline are tracked findings, not completed remediation.
