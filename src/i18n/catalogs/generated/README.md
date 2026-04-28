# Generated catalogs (optional)

This directory may hold **machine-exported** locale JSON (`<locale>.json`) that is merged **before** `catalogs/fallback` during `pnpm i18n:compile`.

The **default workflow is Git-only**: edit `catalogs/source/en.json` and `catalogs/fallback/<locale>.json`, then run `pnpm i18n:sync` (or `pnpm i18n:compile` and `pnpm i18n:validate`).

Do not hand-edit files here unless you are landing an automated export. For CI or local commits that intentionally change `generated/*.json`, set **`I18N_ALLOW_GENERATED_UPDATE=1`** so `pnpm i18n:validate` allows the diff.
