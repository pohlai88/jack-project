# Afenda i18n Operating Model

Afenda uses `next-intl` at runtime and Crowdin for translation production.

## Catalog Layers

- `catalogs/source/en.json` is the only developer-authored message catalog.
- `catalogs/generated/*.json` is localization-platform output from Crowdin.
- `catalogs/fallback/*.json` contains protected bootstrap translations migrated from the previous manual JSON workflow.
- `messages/*.json` is compiled runtime output consumed by `next-intl`; it must never be edited manually.

After editing fallback JSON or when you need stable 2-space formatting and key order across catalogs, run **`pnpm i18n:sync`**. It reformats the English source, rewrites every `catalogs/fallback/*.json` to match the canonical key tree, updates the protected `MANIFEST.json` hashes, runs **`pnpm i18n:compile`**, and then **`pnpm i18n:validate`**.

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

`es`, `id`, and `th` use protected fallback catalogs merged with English; they are runtime-active so URLs, the locale switcher, and tenant defaults may use them even when copy is still maturing.

## Current Runtime Baseline

Runtime i18n is implemented for the active locale set declared in `src/i18n/locale-registry.ts` and mirrored by
`src/i18n/config.ts`: `en`, `zh-CN`, `vi`, `ms`, `es`, `id`, and `th`.

There are no inactive registry locales at the moment (`inactiveLocales` is empty). Add a locale back to `inactiveLocales` only when you intentionally withdraw it from routing while keeping fallback files for later reactivation.

Passing catalog validation means the message ecosystem is structurally sound. It does not mean every active locale is
fully launch-ready. Use `pnpm i18n:readiness:report` and
`architecture/governance/evidence/i18n/I18N_LOCALE_ACTIVATION_SNAPSHOT.md` for the current rollout verdicts.

## How locale configuration is parsed (tooling contract)

Scripts do **not** TypeScript-import the registry. They **parse source text** so `node scripts/*.mjs` stays decoupled from TS project resolution.

### `locale-registry.ts` shape (required)

Export these as **static** `as const` literals (arrays/objects only on the RHS — no function calls):

- `export const activeLocales = [...] as const;`
- `export const inactiveLocales = ... as const;` (may be `[] as const`)
- `export const localeAliases = { ... } as const;`
- `export const localeRegistry = { ... } as const;`

Prefer readable **single-line** `activeLocales` / `inactiveLocales` tuples when practical; `parseExportLiteral` can evaluate multiline `as const` literals, but shorter lines are easier to review in diffs.

### Catalog compile and validation (`scripts/lib/i18n-catalog-core.mjs`)

- **`parseExportLiteral`**: captures the substring between `export const <name> =` and `as const;`, then evaluates it with **`vm.runInNewContext('(' + captured + ')')`** so `activeLocales`, `inactiveLocales`, `localeAliases`, and `localeRegistry` round-trip without hand-maintained duplicate lists.
- **`readConfiguredLocales`**: reads `src/i18n/config.ts`. If it finds `export const locales = activeLocales;`, it re-opens `locale-registry.ts` and splits the **`activeLocales = [...]`** bracket list (same one-line contract). If it finds an explicit `export const locales = ['a', ...] as const;`, it parses that list instead (must match the registry in CI).
- **`compileI18nCatalogs`**: writes **`src/i18n/messages/<locale>.json` for each `activeLocales` entry** and removes `messages/*.json` files whose stem is not active (they are treated as stale compile output).

### Readiness report (`scripts/lib/i18n-readiness-core.mjs`)

- Imports **`readConfiguredLocales`** from `i18n-catalog-core.mjs` (wrapped to throw if the resolved list is empty, so mis-parsed configs fail fast for reporting).
- **`source_artifact_hash`** in `architecture/governance/evidence/i18n/I18N_LOCALE_ACTIVATION_SNAPSHOT.md` is the **SHA-256 of the generated Markdown report body** (`hashMarkdown` in `scripts/lib/docs-hash-utils.mjs`). After snapshot or pipeline changes, run **`pnpm i18n:readiness:report`** and copy the printed **Markdown SHA-256** into the snapshot frontmatter so CI and warn-only enforcement stay aligned.

### Runtime (Next.js / next-intl)

- `src/i18n/config.ts` exports `locales` and `localeNames` for routing and UI.
- **`localeAliases`** map regional tags to primary codes (`ms-MY` → `ms`, `id-ID` → `id`); resolution uses `locale-matching.ts` and `locale-cookie.ts`.

## Documentation Evidence Boundary

Documentation is generated from product truth and is not manually translated per locale.

- Runtime i18n governs application UI messages only.
- Fumadocs content lives under `docs/content`.
- Generated authority lives under `docs/content/generated`.
- Curated explanatory pages live under `docs/content/curated`.
- Do not create locale-specific docs folders or restore the legacy docs feature.
- Locale readiness checks use `docs_evidence_generated`, not per-locale docs coverage.

Before merging documentation improvements, run:

```bash
pnpm docs:ci
pnpm i18n:readiness:report
pnpm i18n:validate
pnpm i18n:fallback-check
```

## Superseded systems

Crowdin is the only supported localization platform for runtime messages. Historical Weblate bootstrap artifacts under `tools/weblate/` have been removed from the repo.

The migration from hand-maintained non-English `messages/*.json` into `catalogs/source`, `catalogs/fallback`, and compiled `messages/` is complete; do not restore locale-specific documentation trees or manual per-locale message JSON outside the catalog model described above.
