# ATC-0009: DB Remediation Execution Gate

## Acceptance Criteria

DB remediation may proceed only when all criteria are satisfied:

- Target Neon project, branch, database, and connection role are identified.
- Neon branch, backup, snapshot, or equivalent restore point exists before mutation.
- Schema diff is reviewed against the target branch.
- Forward-only migration and data movement plan is prepared.
- Rollback strategy is documented.
- Verification queries are documented.
- Explicit project-owner approval is recorded.
- `db:push` is not used for remediation.

## Non-Goals

- This ATC does not authorize live DB mutation.
- This ATC does not require a repo-guard rule.
- This ATC does not create, edit, or execute migrations.
- This ATC does not approve dropping legacy schemas.
