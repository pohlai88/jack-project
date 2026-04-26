# Governance Promotion Review 0004

Date: 2026-04-26

## Verdict

Promoted to enforced governance baseline.

The authority chain is now active:

```text
doctrine -> ADR -> ATC -> repo:guard -> fixture coverage -> CI validation
```

Feature public APIs, promoted doctrine references, artifact hygiene, DB push safety, legacy Jest bans, script drift checks, and deprecated architecture-doc authority claims are now enforced or regression-tested where applicable.

## Governance Wave Scope

PR 1 promoted repo-true architecture rules into authority records. It added doctrine, ADR, and ATC records and wired doctrine checks without changing runtime behavior.

PR 2 turned selected ATC rules into `repo:guard` findings. It preserved the existing short rule ID style and kept `repo:guard` as the final CI authority.

PR 3 extracted repo-guard core logic for fixture testing, added temp Git fixture coverage, and kept the CLI wrapper thin.

PR 4 records the promotion review and evidence snapshot. It does not add enforcement scope or runtime changes.

## Authority Records Promoted

- `architecture/doctrine/0003-documentation-authority-and-promotion.md`
- `architecture/doctrine/0004-environment-script-command-contract.md`
- `architecture/doctrine/0005-database-migration-safety.md`
- `architecture/doctrine/0006-api-auth-tenant-boundaries.md`
- `architecture/doctrine/0007-ui-component-design-system-rules.md`
- `architecture/doctrine/0008-test-ci-artifact-hygiene.md`
- `architecture/adr/0003-governance-as-code-ci-authority.md`
- `architecture/atc/ATC-0003-documentation-promotion.md`
- `architecture/atc/ATC-0004-environment-script-command-contract.md`
- `architecture/atc/ATC-0005-database-migration-safety.md`
- `architecture/atc/ATC-0006-api-auth-tenant-boundaries.md`
- `architecture/atc/ATC-0007-ui-component-design-system-rules.md`
- `architecture/atc/ATC-0008-test-ci-artifact-hygiene.md`

## Enforced Repo Guard Rules

- `RG-SCRIPT-001`: documented package commands must exist.
- `RG-ART-001`: generated artifacts must not be tracked and required ignore policy must remain present.
- `RG-DB-001`: unsafe DB push must remain explicitly gated behind `db:push:unsafe`.
- `RG-DB-002`: migration files and metadata must not target deprecated `saas_template`.
- `RG-TEST-001`: legacy Jest config, dependencies, APIs, and imports are forbidden.
- `RG-DOCS-001`: `architecture/docs/` must not be described as authoritative in top-level docs.
- `RG-FEAT-001`: feature root barrels are required.
- `RG-FEAT-002`: external deep feature imports are forbidden.
- `RG-FEAT-003`: same-feature root barrel and deep alias imports are forbidden.
- `RG-FEAT-004`: broad internal wildcard exports from feature root barrels are forbidden.

## Fixture Coverage Summary

Repo-guard fixture coverage is active under `scripts/__tests__`.

The fixture suite uses temporary Git repositories so rules that depend on tracked-file state are tested against realistic repository behavior. Coverage includes pass and fail cases for script drift, artifact hygiene, DB push safety, migration target bans, Jest bans, deprecated docs authority claims, and feature boundary enforcement.

## Validation Evidence

Fresh validation evidence is recorded in [Governance Evidence Snapshot 0004](./evidence/GOVERNANCE_EVIDENCE_SNAPSHOT_0004.md).

The validation set is:

```bash
pnpm doctrine:check
pnpm repo:guard
pnpm lint
pnpm type-check
pnpm test
pnpm build
git diff --check
```

## Active Followups

The four active review findings are accepted as documented followups.

They do not block governance promotion because current doctrine checks pass, `repo:guard` passes, fixture coverage is active, full validation passes, and PR 4 introduces no product/runtime change.

Followup candidates:

- Live Neon still has `drizzle` and `saas_template`, while runtime schema points to `afenda`.
- The baseline migration was rewritten from `saas_template` to `afenda`; existing databases where the baseline is already recorded will not replay it.
- DevContainer post-create still references deleted `.envrc.example`.
- DevContainer still installs `pnpm@9`, while package policy requires pnpm 10+.

## Next Review Triggers

- DB governance hardening or migration safety remediation.
- DevContainer bootstrap cleanup.
- Package manager alignment.
- Any new feature PR that expands public feature barrels materially.
- Any attempt to promote `architecture/docs/` content without doctrine, ADR, or ATC review.
- Any change that broadens or weakens `repo:guard` rule coverage.

## Non-Blocking Risks

- New doctrine may need future observation after several feature PRs.
- Feature root barrels may still grow too broad over time.
- `architecture/docs/` remains committed and could attract stale edits.
- `repo:guard` is filesystem/text-scan based, not AST-based.
- Script command scanning intentionally ignores prose outside code spans and fenced command blocks.
- DB checks do not validate live Neon state and must not run migrations.
