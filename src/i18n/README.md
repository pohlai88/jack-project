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

## Current Runtime Baseline

Runtime i18n is implemented for the active locale set declared in `src/i18n/locale-registry.ts` and mirrored by
`src/i18n/config.ts`: `en`, `es`, `vi`, `ms`, and `zh-CN`.

The protected fallback inventory also contains `id` and `th`, but those locales are not runtime-active. Do not expose
them in selectors, routing, docs fallback allowances, or user settings until the locale activation gate promotes them.

Passing catalog validation means the message ecosystem is structurally sound. It does not mean every active locale is
fully launch-ready. Use `pnpm i18n:readiness:report` and
`architecture/governance/evidence/i18n/I18N_LOCALE_ACTIVATION_SNAPSHOT.md` for the current rollout verdicts.

## Documentation Improvement Path

The next documentation work should improve native docs coverage before changing activation state.

- Treat `es` as the reference native-docs locale.
- Prioritize native docs for `vi`, `ms`, and `zh-CN`; these locales are runtime-active but currently rely on approved
  visible English docs fallback.
- Keep `id` and `th` as inactive draft locales unless a separate activation change updates the registry, runtime config,
  docs state, governance snapshot, and validation evidence.
- Preserve `fallbackAllowedLocales` only where visible English fallback is intentionally approved for missing native docs.
- Add translated docs under `src/features/docs/content/<locale>/` with source metadata matching the canonical English doc
  hash from `pnpm docs:hash` (or run `pnpm docs:hash:write` to refresh every `translation.sourceHash` from English).
- For **new or reordered** canonical English help pages, set `section`, `order`, and `navTitleKey` in frontmatter, then run
  `pnpm docs:generate-nav` and commit `docs-nav-pages.generated.json`. `pnpm docs:check` enforces the manifest.
  See [ADR-0006](../../architecture/adr/0006-in-app-docs-git-nav-and-continuous-localization-future.md).

Before merging documentation improvements, run:

```bash
pnpm docs:generate-nav
pnpm docs:hash:write
pnpm docs:check
pnpm i18n:readiness:report
pnpm i18n:compile --check
pnpm i18n:validate
pnpm i18n:fallback-check
```
