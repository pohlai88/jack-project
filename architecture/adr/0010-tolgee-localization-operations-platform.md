# ADR-0010: Tolgee as localization operations platform (proposed)

## Status

Proposed — move to **Accepted** when acceptance criteria below are satisfied (operator closure, not another mandatory code PR).

**Acceptance criteria (ADR → Accepted)**

1. Repository secret **`TOLGEE_API_KEY`** is configured for CI ([evidence workflow](../governance/evidence/i18n/TOLGEE_INTEGRATION.md#github-actions-optional)).
2. **One** real non-English round-trip is proven: Tolgee export → normalize → `pnpm i18n:compile` → `pnpm i18n:validate` with translated content (locale-tag mapping via [`tolgee-locale-map.json`](../../src/i18n/tolgee-locale-map.json) as needed). Proves the operating model; does **not** require every locale.

**Adoption progress**

- **Documentation / decision slice:** complete (this ADR, evidence note, ADR index, cross-links to ADR-0005 / ADR-0009).
- **Operational round-trip spike (PR 1B):** complete — [`TOLGEE_INTEGRATION.md`](../governance/evidence/i18n/TOLGEE_INTEGRATION.md).
- **Engineering integration (normalize, locale map, optional CI):** complete — same evidence note; **no further mandatory implementation slice** unless product scope changes.

## Context

Afenda already separates **runtime locale authority** ([ADR-0009](./0009-runtime-locale-authority-app-router.md), doctrine I18N-RUNTIME-001) from **translation supply** ([ADR-0005](./0005-continuous-localization-operating-model.md): Git-native catalogs, compile to `messages/`, CI validation). Operators need industrial-scale translation workflow (TM, MT, review, screenshots, import/export) without introducing a second runtime locale source or bypassing Git and CI.

Tolgee is a translation management system (TMS) and platform that can sit **beside** the existing `next-intl` spine if boundaries are explicit.

## Decision

Afenda may adopt Tolgee as a **localization operations platform** for translation management, machine translation, translation memory, screenshot and context review, and import/export workflows.

Tolgee is **not** a runtime locale authority. Tolgee output must enter the repository as catalog files and pass the existing **compile and validation pipeline** before it can affect shipped runtime messages.

**Catalog promotion rule:** Raw Tolgee exports are **unreviewed staging** until normalized. They must not be promoted into [`src/i18n/catalogs/fallback/`](../../src/i18n/catalogs/fallback/) or into flat [`src/i18n/catalogs/generated/<locale>.json`](../../src/i18n/catalogs/generated/) (the shape consumed by compile today) without **explicit human review** (reviewed PR merge) and passing **`pnpm i18n:validate`** (and related i18n gates as applicable). Staging uses gitignored paths under [`tolgee-staging/`](../../src/i18n/catalogs/tolgee-staging/) plus **`pnpm i18n:tolgee:normalize`** ([evidence](../governance/evidence/i18n/TOLGEE_INTEGRATION.md)).

**Single TMS authority (organizational):** One translation management system should own **Afenda runtime-bound catalog intake** for Git; parallel TMS authorities create drift. This ADR assumes **Tolgee** plays that role unless org policy selects another system — then update ADR and tooling explicitly.

**Relationship to existing ADRs:**

- **[ADR-0005](./0005-continuous-localization-operating-model.md)** remains the **Git-native catalog supply chain** (source, generated, fallback, compile order, CI).
- **[ADR-0009](./0009-runtime-locale-authority-app-router.md)** remains **which locale the App Router request renders** (`[locale]` + `next-intl`). Tolgee must not change that authority.

## Non-goals (this phase)

Afenda will **not** fetch production runtime translations directly from Tolgee in this phase.

Concretely for early adoption:

- No Tolgee SDK on the production runtime path as the source of truth for shipped strings.
- No change to [`src/i18n/request.ts`](../../src/i18n/request.ts), [`src/app/[locale]/layout.tsx`](../../src/app/[locale]/layout.tsx), or [`src/proxy.ts`](../../src/proxy.ts) solely to wire Tolgee as locale or message authority.
- No production **`NEXT_PUBLIC_*`** exposure of Tolgee API keys (see [TOLGEE_INTEGRATION.md](../governance/evidence/i18n/TOLGEE_INTEGRATION.md) secret contract).

## Consequences

**Positive**

- Translators gain TMS features without replacing `next-intl` or the `[locale]` URL contract.
- Shipped messages remain **Git + CI** artifacts; Tolgee improves human/ops workflow upstream of merge.

**Tradeoffs**

- Import/export and ICU/nested-key round-trips must be proven and scripted; operators carry sync discipline until automation is stable.
- Staging vs reviewed catalog hygiene must stay explicit to protect `fallback` as a governed layer.

## Closure (documentation slice)

The **documentation and governance decision slice** for this ADR is complete: Proposed decision, non-goals, catalog promotion rule, ADR index entry, cross-links to ADR-0005 and ADR-0009, and the evidence note with secret contract and spike procedure.

The **Tolgee round-trip spike** is **complete** — see [`TOLGEE_INTEGRATION.md`](../governance/evidence/i18n/TOLGEE_INTEGRATION.md) (credentialed push/pull, `spike-check`, `zh-CN` export contract, baseline `pnpm i18n:validate`).

**Validated:** `pnpm doctrine:check`, `pnpm i18n:validate`, `pnpm type-check`, `pnpm repo:guard`. Discoverability: [`src/i18n/README.md`](../../src/i18n/README.md) includes **Translation operations (Tolgee, proposed)**.

## References

- Evidence, PR 1B spike task, results table, and full closure wording: [`architecture/governance/evidence/i18n/TOLGEE_INTEGRATION.md`](../governance/evidence/i18n/TOLGEE_INTEGRATION.md)
- Canonical spike JSON + tooling: [`TOLGEE_INTEGRATION.md`](../governance/evidence/i18n/TOLGEE_INTEGRATION.md), [`tolgee.config.cjs`](../../tolgee.config.cjs) ([Tolgee CLI configuration](https://docs.tolgee.io/tolgee-cli/project-configuration))
- Tolgee documentation: https://docs.tolgee.io/
- next-intl + Tolgee (App Router): https://docs.tolgee.io/js-sdk/integrations/react/next/app-router-next-intl
