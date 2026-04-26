# Manual JSON Translation Migration

Manual non-English JSON maintenance is deprecated.

The previous files under `src/i18n/messages/*.json` have been split into the continuous localization model:

- `en.json` became `src/i18n/catalogs/source/en.json`
- existing non-English JSON files became protected fallback/bootstrap catalogs under `src/i18n/catalogs/fallback/`
- `src/i18n/messages/*.json` remains in the repo only as compiled runtime output for active locales

Do not manually edit non-English fallback or runtime message files. Future translation production must come through Crowdin and land as generated catalog PRs.
