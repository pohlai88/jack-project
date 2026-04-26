# Afenda i18n Operating Model

Afenda uses `next-intl` at runtime and Crowdin for translation production.

## Catalog Layers

- `catalogs/source/en.json` is the only developer-authored message catalog.
- `catalogs/generated/*.json` is localization-platform output from Crowdin.
- `catalogs/fallback/*.json` contains protected bootstrap translations migrated from the previous manual JSON workflow.
- `messages/*.json` is compiled runtime output consumed by `next-intl`; it must never be edited manually.

## Flow

Developer changes English source -> extraction and validation -> Crowdin source upload -> translator/MT/TM workflow -> generated locale PR -> compile runtime messages -> CI validation -> locale activation.

## Locale Activation

Locales are activated only through `src/i18n/locale-registry.ts` and `src/i18n/config.ts`.

Before activation, the locale must have:

- source coverage against English keys
- valid ICU syntax, placeholders, rich-text tags, and plural/select forms
- approved fallback behavior
- protected fallback hash or generated Crowdin output
- CI proof from `i18n:compile --check`, `i18n:validate`, `i18n:coverage`, and `i18n:fallback-check`

`id` and `th` are protected fallback catalogs only and remain inactive until explicitly activated.
