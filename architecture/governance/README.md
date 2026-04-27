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
- [Locale Coverage Expansion Plan 0008](./LOCALE_COVERAGE_EXPANSION_PLAN_0008.md)
- [Tenant Language Settings Alignment Plan 0009](./TENANT_LANGUAGE_SETTINGS_ALIGNMENT_PLAN_0009.md)
- [Locale Activation Readiness Checklist 0010](./LOCALE_ACTIVATION_READINESS_CHECKLIST_0010.md)
- [ATC-0010: Locale Activation Readiness](../atc/ATC-0010-locale-activation-readiness.md)
- [I18N Locale Activation Snapshot](./evidence/i18n/I18N_LOCALE_ACTIVATION_SNAPSHOT.md)
- [next-intl best-practice audit (Context7)](./evidence/i18n/NEXT_INTL_BEST_PRACTICE_AUDIT.md)

## Authority Boundary

- Current doctrine lives in `architecture/doctrine/`.
- Architecture decisions live in `architecture/adr/`.
- Architecture test cases live in `architecture/atc/`.
- `architecture/docs/` remains a deprecated tombstone.
- `repo:guard` is the CI authority for promoted enforcement.
- ESLint remains local feedback unless a rule is also enforced by `repo:guard`.
