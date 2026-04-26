# ADR-0005: Continuous Localization Operating Model

## Status

Accepted

## Context

Afenda previously kept runtime message JSON files directly under `src/i18n/messages/`. That model does not scale to 150+ locales because developers would be expected to keep every locale file in sync manually.

The runtime layer is working and does not need replacement. The gap is the translation supply chain.

## Decision

Keep `next-intl` as the runtime i18n layer.

English is the canonical developer-authored source locale. Crowdin is the authoritative localization platform for generated translations. Existing non-English JSON files are preserved as protected fallback/bootstrap assets, not as the future translation workflow.

Catalog ownership is split:

- `src/i18n/catalogs/source/en.json`: developer-authored source
- `src/i18n/catalogs/generated/*.json`: Crowdin output
- `src/i18n/catalogs/fallback/*.json`: protected bootstrap fallback
- `src/i18n/messages/*.json`: compiled runtime output only

Runtime compilation precedence is:

1. English source for `en`
2. generated Crowdin catalog for non-English locales
3. protected fallback catalog
4. default English fallback

## Consequences

- Developers edit only English source messages.
- Manual non-English JSON maintenance is deprecated.
- Runtime behavior stays on `next-intl`.
- `id` and `th` remain inactive until activation governance explicitly promotes them.
- Crowdin sync PRs must compile runtime messages and pass validation before merge.
