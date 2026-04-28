# Afenda i18n Operating Model

Afenda uses `next-intl` at runtime. **Runtime messages are Git-managed:** English source plus per-locale fallback catalogs (and optional generated catalogs) compiled to `messages/`. An optional **translation operations** platform (Tolgee) is under evaluation as **TMS only**—not a runtime message source; see [ADR-0010](../../architecture/adr/0010-tolgee-localization-operations-platform.md) and [Translation operations (Tolgee, proposed)](#translation-operations-tolgee-proposed) below.

## Runtime locale authority (I18N-RUNTIME-001)

**Normative doctrine:** [architecture/doctrine/0009-i18n-runtime-locale-authority.md](../../architecture/doctrine/0009-i18n-runtime-locale-authority.md). **ADR:** [architecture/adr/0009-runtime-locale-authority-app-router.md](../../architecture/adr/0009-runtime-locale-authority-app-router.md).

For App Router pages under `src/app/[locale]/`, the **`[locale]` URL segment** is the sole **runtime** locale authority. `next-intl` resolves it (`requestLocale` / routing), validates it (`hasLocale`), binds it (`setRequestLocale` in the root locale layout), and distributes it (`NextIntlClientProvider`, `useLocale`, `getLocale`, `useTranslations`, `getTranslations`).

| Layer                                                      | Role                                                                                                                                        |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [`routing.ts`](./routing.ts)                               | Canonical locale list + default for `defineRouting`                                                                                         |
| [`../proxy.ts`](../proxy.ts)                               | Entrypoint / redirect shaping (e.g. tenant host rewrites into a localized path); must not replace resolved locale inside `getRequestConfig` |
| [`request.ts`](./request.ts)                               | `getRequestConfig`: validate + load messages; **no** cookie/header/tenant/profile locale override                                           |
| [`../app/[locale]/layout.tsx`](../app/[locale]/layout.tsx) | `setRequestLocale`, `getMessages`, `NextIntlClientProvider`                                                                                 |
| [`navigation.ts`](./navigation.ts)                         | Locale-aware links and redirects                                                                                                            |

**Preference vs resolved:** Cookies, tenant defaults, profile fields, and `Accept-Language` may drive **redirects** or **first path** onto a locale URL. They must not silently change the rendered locale for a request whose path already includes a valid `[locale]` (see doctrine wording). Catalog fallback (missing keys) is a **copy** concern under [ADR-0005](../../architecture/adr/0005-continuous-localization-operating-model.md), not a second locale authority.

## Catalog Layers

- `catalogs/source/en.json` is the only developer-authored message catalog.
- `catalogs/generated/*.json` is optional machine-exported JSON merged before fallback during compile (directory may be empty).
- `catalogs/fallback/*.json` contains protected bootstrap translations and normal Git-reviewed locale copy.
- `messages/*.json` is compiled runtime output consumed by `next-intl`; it must never be edited manually.

## Translation operations (Tolgee, proposed)

[ADR-0010](../../architecture/adr/0010-tolgee-localization-operations-platform.md) (Proposed) may adopt Tolgee for **localization operations** (workflow, TM, MT, import/export). **Runtime locale authority** stays the `[locale]` URL segment + `next-intl` ([ADR-0009](../../architecture/adr/0009-runtime-locale-authority-app-router.md)); Tolgee does not replace Git catalogs or CI as the ship path for runtime strings.

**Where to work next:** [TOLGEE_INTEGRATION.md](../../architecture/governance/evidence/i18n/TOLGEE_INTEGRATION.md) — spike closed; **normalize** Tolgee exports with **`pnpm i18n:tolgee:normalize`** and [`tolgee-locale-map.json`](./tolgee-locale-map.json) before promoting to `catalogs/generated`.

For local spike exports, use **`src/i18n/catalogs/tolgee-staging/`** (gitignored). Do not commit unreviewed Tolgee JSON to `catalogs/fallback` or flat `catalogs/generated/<locale>.json` on `main` without review + **`I18N_ALLOW_GENERATED_UPDATE=1`**. Env: **`TOLGEE_API_KEY`** (never `NEXT_PUBLIC_TOLGEE_API_KEY`); optional **`TOLGEE_PROJECT_ID`** / **`TOLGEE_API_URL`** only when tooling requires them — Tolgee Cloud defaults apply ([evidence](../../architecture/governance/evidence/i18n/TOLGEE_INTEGRATION.md)).

**Shape check:** `pnpm i18n:tolgee:spike-check` — canonical sample [`tolgee-spike-sample-canonical.json`](../../architecture/governance/evidence/i18n/tolgee-spike-sample-canonical.json). **CLI / pull / normalize / CI bundle:** [`tolgee.config.cjs`](../../tolgee.config.cjs), `pnpm i18n:tolgee:cli -- pull`, `pnpm i18n:tolgee:pull`, `pnpm i18n:tolgee:normalize`, **`pnpm i18n:tolgee:ci`** (matches optional workflow [`tolgee-i18n.yml`](../../.github/workflows/tolgee-i18n.yml)).

After editing fallback JSON or when you need stable 2-space formatting and key order across catalogs, run **`pnpm i18n:sync`**. It reformats the English source, rewrites every `catalogs/fallback/*.json` to match the canonical key tree, updates the protected `MANIFEST.json` hashes, runs **`pnpm i18n:compile`**, and then **`pnpm i18n:validate`**.

## Flow

Developer changes English source -> extraction and validation -> translators/loc engineers update `catalogs/fallback/*.json` in Git (optional `catalogs/generated` from automation) -> `pnpm i18n:compile` -> CI validation (`i18n:validate`, coverage, fallback manifest) -> locale activation in `locale-registry.ts` when ready.

## Locale Activation

Locales are activated only through `src/i18n/locale-registry.ts` and `src/i18n/config.ts`.

Before activation, the locale must have:

- source coverage against English keys
- valid ICU syntax, placeholders, rich-text tags, and plural/select forms
- approved fallback behavior
- protected fallback hash (or optional generated catalog provenance when present)
- CI proof from `i18n:compile --check`, `i18n:validate`, `i18n:coverage`, and `i18n:fallback-check`

Every non-English **active** locale uses a protected fallback catalog (merged with English at compile time) where configured; routing and the locale switcher follow `activeLocales` in the registry. Readiness and copy maturity still vary by locale—use the snapshot report below, not this README, for rollout verdicts.

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

Weblate bootstrap artifacts were removed from the repo. The migration from hand-maintained non-English `messages/*.json` into `catalogs/source`, `catalogs/fallback`, and compiled `messages/` is complete; do not restore locale-specific documentation trees or manual per-locale message JSON outside the catalog model described above.
