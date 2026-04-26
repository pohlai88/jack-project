# ATC-0003: Documentation Promotion

## Acceptance Criteria

- `architecture/docs/README.md` clearly marks `architecture/docs/` as a deprecated tombstone.
- Top-level README, CONTRIBUTING, and AGENTS do not call `architecture/docs/` the source of truth.
- Promoted rules live in doctrine, decisions live in ADRs, and enforceable contracts live in ATCs.
- `pnpm doctrine:check` passes.
