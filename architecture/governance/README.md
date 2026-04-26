# Governance

Governance records capture promotion reviews and validation evidence for the enforced architecture baseline.

## Records

- [Governance Promotion Review 0004](./GOVERNANCE_PROMOTION_REVIEW_0004.md)
- [Governance Evidence Snapshot 0004](./evidence/GOVERNANCE_EVIDENCE_SNAPSHOT_0004.md)
- [DB Schema Remediation Plan 0005](./DB_SCHEMA_REMEDIATION_PLAN_0005.md)
- [Governance Evidence Snapshot 0005](./evidence/GOVERNANCE_EVIDENCE_SNAPSHOT_0005.md)
- [ADR 0004: DB Schema Remediation Decision](../adr/0004-db-schema-remediation-decision.md)
- [ATC-0009: DB Remediation Execution Gate](../atc/ATC-0009-db-remediation-execution-gate.md)
- [Neon Branch Verification Plan 0007](./NEON_BRANCH_VERIFICATION_PLAN_0007.md)
- [Neon Branch Verification Evidence 0007](./evidence/NEON_BRANCH_VERIFICATION_EVIDENCE_0007.md)

## Authority Boundary

- Current doctrine lives in `architecture/doctrine/`.
- Architecture decisions live in `architecture/adr/`.
- Architecture test cases live in `architecture/atc/`.
- `architecture/docs/` remains deprecated reference material.
- `repo:guard` is the CI authority for promoted enforcement.
- ESLint remains local feedback unless a rule is also enforced by `repo:guard`.
