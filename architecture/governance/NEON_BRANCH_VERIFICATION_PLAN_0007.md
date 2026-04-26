# Neon Branch Verification Plan 0007

Date: 2026-04-26

## Status

Verification plan only. No Neon command, SQL query, migration, or DB mutation is executed by PR 7.

## Purpose

Define how future DB remediation can inspect Neon branch state safely before any approved forward-only remediation work.

This plan is bound by:

- `architecture/adr/0004-db-schema-remediation-decision.md`
- `architecture/atc/ATC-0009-db-remediation-execution-gate.md`

`afenda` remains the canonical runtime schema. DB remediation remains forward-only and approval-gated.

## Target Information To Capture

Before inspection, record:

- Neon project name and project ID
- branch name and branch ID
- database name
- connection role
- connection source used for inspection
- runtime schema target: `afenda`
- legacy schemas observed, if present: `drizzle`, `saas_template`
- inspection timestamp
- inspecting operator

## Read-Only Verification Steps

Use only read-only queries or read-only Neon schema diff tools.

Allowed inventory queries:

```sql
SELECT schema_name FROM information_schema.schemata;
SELECT table_schema, table_name FROM information_schema.tables;
SELECT table_schema, table_name, column_name, data_type FROM information_schema.columns;
SELECT * FROM drizzle.__drizzle_migrations;
```

Record results in `architecture/governance/evidence/NEON_BRANCH_VERIFICATION_EVIDENCE_0007.md` or a later evidence record before remediation proceeds.

## Schema Diff Evidence

Before remediation, capture schema diff evidence with one of:

- Neon Console schema diff
- Neon CLI schema diff
- Neon API schema diff

The schema diff must identify the compared branch/database pair and summarize whether the diff confirms the expected runtime schema, legacy schema presence, and migration-table state.

## Snapshot And Backup Expectation

Read-only verification may inspect current state without a new branch.

Any later mutation requires a Neon branch, backup, snapshot, or equivalent restore point before execution, as required by `ATC-0009`.

## No-Mutation Boundary

Forbidden SQL or command categories:

```text
DROP
ALTER
CREATE
TRUNCATE
DELETE
UPDATE
INSERT
drizzle-kit push
pnpm db:push
pnpm db:migrate
```

This PR does not authorize mutation. Any future mutation requires explicit project-owner approval and a forward-only migration/data movement plan.

## Validation Commands

These commands validate repo health only. They do not verify live Neon state.

```bash
pnpm doctrine:check
pnpm repo:guard
pnpm lint
pnpm type-check
pnpm test
pnpm build
git diff --check
```

## References

- [Neon branching docs](https://neon.com/docs/introduction/branching.md)
- [Neon schema diff docs](https://neon.com/docs/guides/schema-diff?refcode=44WD03UH)
