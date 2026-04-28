# ADR-0005: Continuous Localization Operating Model (Git-native runtime messages)

> Filename retains **continuous-localization** for stable links. Runtime UI strings are **Git-managed** (English `catalogs/source`, human `catalogs/fallback`, optional machine `catalogs/generated`); there is no external translation platform in-repo.

## Status

Accepted

## Context

Afenda previously kept runtime message JSON files directly under `src/i18n/messages/`. That model does not scale to 150+ locales because developers would be expected to keep every locale file in sync manually.

The runtime layer is working and does not need replacement. The translation supply chain is **Git-centric**: PRs to protected fallback catalogs (and rare generated exports), validated by existing Node i18n scripts.

## Decision

Keep `next-intl` as the runtime i18n layer.

English is the canonical developer-authored source locale. **Non-English copy is Git-managed:** protected fallback catalogs (`catalogs/fallback`) and normal PR review; optional machine exports may land under `catalogs/generated` when explicitly allowed by tooling env vars.

Catalog ownership is split:

- `src/i18n/catalogs/source/en.json`: developer-authored source
- `src/i18n/catalogs/generated/*.json`: optional machine-exported JSON (may be absent)
- `src/i18n/catalogs/fallback/*.json`: protected bootstrap and human-reviewed translations
- `src/i18n/messages/*.json`: compiled runtime output only

Runtime compilation precedence is:

1. English source for `en`
2. optional generated catalog for non-English locales (when present)
3. protected fallback catalog
4. default English fallback

## Consequences

- Developers edit English source messages; locale updates ship via Git changes to fallback (or rare generated exports).
- Direct hand-edits to compiled `messages/*.json` remain forbidden; compile is the single writer.
- Runtime behavior stays on `next-intl`.
- Runtime locale membership is **config-driven** in `src/i18n/locale-registry.ts` (`activeLocales` / `inactiveLocales`). All locales in the approved target set may be active at once; governance snapshots (`I18N_LOCALE_ACTIVATION_SNAPSHOT.md`) record readiness and QA, not whether routing exposes a locale.
- Localization PRs must run `pnpm i18n:compile`, `pnpm i18n:validate`, `pnpm i18n:coverage`, and `pnpm i18n:fallback-check` before merge.

## Related decisions

- **[ADR-0009](./0009-runtime-locale-authority-app-router.md)** defines **which locale a localized App Router request renders** (`[locale]` URL segment as sole runtime authority, `next-intl` binding). This ADR-0005 remains the **translation supply chain** (catalogs, compile, validation). Do not conflate the two.
- **[ADR-0010](./0010-tolgee-localization-operations-platform.md)** (Proposed) may adopt **Tolgee** as a **localization operations** platform (TMS import/export, workflow). Shipped runtime messages still flow through this ADR’s Git catalogs and CI; Tolgee is not a runtime message source in that proposal’s initial phase.
