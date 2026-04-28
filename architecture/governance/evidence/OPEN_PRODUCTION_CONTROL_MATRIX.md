# Open Production Control Matrix

## Executive summary

The repository already holds sufficient planning artifacts for production rollout, locale governance, Neon verification, database remediation, and Tolgee integration. What remains open is **not** primarily missing implementation in one undifferentiated backlog. It is split across **operator execution**, **evidence collection**, **approval-gated remediation**, and **future controlled rollout**, each with a different owner and a different “done” definition.

**No database mutation, migration execution, locale activation, or runtime production behavior change is authorized by this matrix.**

## Control lanes

| Lane                                 | Label                             | Meaning                                                                                                               |
| ------------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Lane A — Production Operator Runbook | Pending operator execution        | Work that requires production operator action outside normal code implementation (DNS, IdP, deploy, rotation, smoke). |
| Lane B — Evidence pending            | Evidence pending                  | Next step is proof capture (logs, URLs, inspection outputs), not feature coding.                                      |
| Lane C — Approval-gated DB           | Blocked pending explicit approval | Work that must not execute until read-only verification evidence exists and explicit approval is recorded.            |
| Lane D — Future controlled rollout   | Future controlled rollout         | Product or process work that needs a separate decision before implementation (locales, Tolgee ops).                   |

## Lane C — database and Neon (guardrail)

**DB remediation is not authorized by this matrix.** The required sequence is:

1. Read-only Neon verification ([NEON_BRANCH_VERIFICATION_PLAN_0007.md](../NEON_BRANCH_VERIFICATION_PLAN_0007.md), evidence in [NEON_BRANCH_VERIFICATION_EVIDENCE_0007.md](NEON_BRANCH_VERIFICATION_EVIDENCE_0007.md)).
2. Evidence completion and review.
3. Explicit approval (see [ATC-0009-db-remediation-execution-gate.md](../../atc/ATC-0009-db-remediation-execution-gate.md)).
4. Forward-only remediation **only if** approved ([DB_SCHEMA_REMEDIATION_PLAN_0005.md](../DB_SCHEMA_REMEDIATION_PLAN_0005.md)).

Do not run migrations, `db:push`, schema cleanup, or “helpful automation” against live Neon state under this artifact.

## Open control matrix

| Control area                                                         | Source artifact                                                                                                                                                           | Owner type                | Status                          | Next action                                                                                                                                                                                          | Blocker                             |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Nexuscanon DNS (`www`, `*.nexuscanon.com`, not bare apex on project) | [tenants/TENANT_SUBDOMAIN_VERCEL_DNS.md](tenants/TENANT_SUBDOMAIN_VERCEL_DNS.md)                                                                                          | Operator                  | Pending operator execution      | Verify registrar + Vercel project domains match policy; use `pnpm vercel:domain:remove-apex` if bare apex appears                                                                                    | DNS / Vercel access                 |
| Vercel Production env (values + drift vs local)                      | [env.config.example](../../../env.config.example), [scripts/production-env-plan.mjs](../../../scripts/production-env-plan.mjs), `pnpm vercel:env:*`                       | Operator                  | Mostly prepared in repo         | Confirm secrets ownership; run `pnpm vercel:env:report`; push with `pnpm vercel:env:push-production` when values final                                                                               | Secret / org ownership              |
| Auth0 / IdP callbacks vs `AUTH_URL`                                  | [NEXUSCANON_RELEASE_ROLLOUT.md](NEXUSCANON_RELEASE_ROLLOUT.md), [AGENTS.md](../../../AGENTS.md)                                                                           | Operator                  | Deferred                        | Configure `AUTH0_*` in `env.config`, sync, push; align IdP URLs with `https://www.nexuscanon.com` when Auth0 is enabled                                                                              | IdP decision                        |
| Production deploy                                                    | [NEXUSCANON_RELEASE_ROLLOUT.md](NEXUSCANON_RELEASE_ROLLOUT.md)                                                                                                            | Operator                  | Pending operator execution      | Deploy when `pnpm build` and pre-deploy checks pass (`pnpm deploy:vercel:production`)                                                                                                                | Operator approval                   |
| Post-deploy smoke (URLs, OAuth, wildcard tenant, cookies)            | [NEXUSCANON_RELEASE_ROLLOUT.md](NEXUSCANON_RELEASE_ROLLOUT.md), ADR 0008                                                                                                  | Operator / evidence       | Evidence pending                | Execute post-deploy checklist; record outcomes in rollout or linked evidence                                                                                                                         | Production deploy                   |
| Neon branch verification (read-only)                                 | [NEON_BRANCH_VERIFICATION_PLAN_0007.md](../NEON_BRANCH_VERIFICATION_PLAN_0007.md), [NEON_BRANCH_VERIFICATION_EVIDENCE_0007.md](NEON_BRANCH_VERIFICATION_EVIDENCE_0007.md) | Operator / evidence       | Blocked pending explicit inputs | Provide Neon identifiers; run approved read-only inspection; fill evidence                                                                                                                           | Operator-provided target + approval |
| DB schema remediation                                                | [DB_SCHEMA_REMEDIATION_PLAN_0005.md](../DB_SCHEMA_REMEDIATION_PLAN_0005.md), ATC-0009                                                                                     | DB / governance           | Approval-gated                  | No mutation until Neon evidence + explicit approval                                                                                                                                                  | Read-only evidence + approval       |
| Locale expansion (next locales)                                      | [LOCALE_COVERAGE_EXPANSION_PLAN_0008.md](../LOCALE_COVERAGE_EXPANSION_PLAN_0008.md)                                                                                       | Product / governance      | Future controlled rollout       | Activate locales only through documented gates (`pnpm i18n:*`)                                                                                                                                       | Scope decision                      |
| pt language drift                                                    | [TENANT_LANGUAGE_SETTINGS_ALIGNMENT_PLAN_0009.md](../TENANT_LANGUAGE_SETTINGS_ALIGNMENT_PLAN_0009.md)                                                                     | Product / i18n governance | Open decision                   | Choose one path: migrate stored `pt` rows away from unsupported locale, or activate `pt` through full locale pipeline. Recommendation: migrate away unless Portuguese is a near-term product target. | Product decision                    |
| Tolgee operating model                                               | [i18n/TOLGEE_INTEGRATION.md](i18n/TOLGEE_INTEGRATION.md)                                                                                                                  | Ops / product             | Optional / process              | Close operating model (TMS, ownership) if Tolgee is in use; coded integration is already complete                                                                                                    | Process decision                    |

## Related

- Operator runbook and checklist: [NEXUSCANON_RELEASE_ROLLOUT.md](NEXUSCANON_RELEASE_ROLLOUT.md)
- Cookie / tenant subdomain doctrine: [ADR 0008](../../adr/0008-cookie-domain-tenant-subdomains.md)
