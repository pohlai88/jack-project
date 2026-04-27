# Crowdin Localization Workflow

Crowdin is Afenda's authoritative localization platform.

The repository owns:

- English source messages in `src/i18n/catalogs/source/en.json`
- validation and compilation scripts
- protected fallback/bootstrap catalogs
- locale activation governance (`activeLocales` in `src/i18n/locale-registry.ts`; script parsing contract in `src/i18n/README.md`)

Crowdin owns:

- translator, MT, and translation-memory workflow
- generated locale catalogs under `src/i18n/catalogs/generated/*.json`
- translation sync pull requests labeled `i18n-platform-sync`

## Commands

```bash
pnpm i18n:extract
pnpm i18n:platform:upload-source
pnpm i18n:platform:download-translations
pnpm i18n:compile
pnpm i18n:validate
pnpm i18n:coverage
pnpm i18n:fallback-check
```

Crowdin credentials must come from environment variables or GitHub Secrets:

- `CROWDIN_PROJECT_ID`
- `CROWDIN_PERSONAL_TOKEN`

Do not commit secrets.

## Catalog Mapping

`crowdin.yml` uploads `src/i18n/catalogs/source/en.json` and downloads translations to `src/i18n/catalogs/generated/%locale%.json`.

Runtime files in `src/i18n/messages/*.json` are compiled output only. Do not edit them manually.
