# Tolgee integration (evidence note)

**Working note** supporting [ADR-0010](../../../adr/0010-tolgee-localization-operations-platform.md) (Proposed).  
**Purpose:** Record goals, boundaries, documentation links, secret contract, round-trip spike expectations, and **recorded spike outcomes** before production sync automation.

## Status

The **decision / evidence documentation slice** is complete and validated (ADR-0010, ADR index, ADR-0005 / ADR-0009 cross-links, this note, secret contract, catalog promotion policy). No runtime i18n behavior was changed; no Tolgee SDK or production integration was added.

**Tolgee engineering integration:** **complete** — normalize, locale map, optional CI workflow, and `pnpm i18n:tolgee:ci` are implemented. **Do not treat further Tolgee work as a mandatory coded PR slice** unless product scope changes; remaining work is **operating model closure** (below).

**Tolgee automation dry-run:** Recorded — see [Tolgee automation dry-run](#tolgee-automation-dry-run).

The **Tolgee round-trip spike (PR 1B)** is **closed** — see [Spike results](#spike-results).

## Tolgee operating model closure

Track this under **operating model closure**, not another implementation milestone:

| Step                          | Owner       | Notes                                                                                                                                                                                                                                                                                                                  |
| ----------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`TOLGEE_API_KEY`**          | Operator    | Add as **GitHub repository secret** for [`tolgee-i18n.yml`](../../../../.github/workflows/tolgee-i18n.yml). **Tolgee CI is intentionally passive until the secret exists** — a skipped workflow is expected, not an engineering failure.                                                                               |
| **Optional locale proof**     | Operator    | Once Tolgee has **real translated content** for a Chinese column (e.g. **`zh-Hans-CN`**), verify **Tolgee export → [`tolgee-locale-map.json`](../../../../src/i18n/tolgee-locale-map.json) → `catalogs/generated/zh-CN.json` → compile → `messages/zh-CN.json`** — operational proof of the locale bridge, not a PR 4. |
| **Merge / review discipline** | Team        | Tolgee may feed **`catalogs/generated/`**, but strings **ship only after human-reviewed PR merge** (Git + CI). No silent production mutation from TMS alone.                                                                                                                                                           |
| **ADR-0010 → Accepted**       | Maintainers | Move status when **`TOLGEE_API_KEY`** is configured **and** one real non-English round-trip is proven (accepts the **model**, not every language).                                                                                                                                                                     |
| **Single TMS authority**      | Org         | **Exactly one** TMS should own **runtime-bound catalogs** for Afenda. Current implementation is **Tolgee-first**; other systems (e.g. Crowdin) must be **migration, archive, or evaluation** channels only — not parallel authorities. Resolve org-wide before scaling translators.                                    |

## Current Tolgee gate

**Safe optional behavior proven:**

- No **`TOLGEE_API_KEY`** → `pnpm i18n:tolgee:pull` skips safely (exit 0).
- `scripts/tolgee-export-pull.mjs` passes ESLint.

**Credentialed spike (done):**

- **`pnpm i18n:tolgee:cli:push-spike`** → **`pnpm i18n:tolgee:pull`** → unzip → **`pnpm i18n:tolgee:spike-check`** on exported `en.json` (includes rich-shaped + ICU `select` leaf).
- **`zh-CN`:** REST accepts `languages=zh-CN`; without that language populated in the Tolgee project, export returns **`no_exported_result`** (HTTP 400) — explicit, not silent English leakage.
- **`pnpm i18n:validate`** — baseline repo catalogs pass; Tolgee staging stays gitignored until PR 2 promotion wiring.

**Optional later (operators):** Add **简体中文 (`zh-CN`)** as a project language in Tolgee and translate at least one key, then re-run **`pnpm i18n:tolgee:pull -- --languages=zh-CN`** to capture `zh-CN.json` in the export ZIP for filename spot-check.

## Summary

Tolgee is evaluated and may be adopted as a **localization operations** platform (TMS: workflow, TM, MT, screenshots, import/export). It is **not** the runtime locale authority and **not** a bypass for Git catalogs or CI.

**Adoption phrase (precision):**

- Adopt Tolgee as **localization operations**.
- Do **not** adopt Tolgee as **runtime authority**.
- Do **not** let Tolgee bypass **Git + CI**.

## Goals

- Give translators and vendors a TMS without changing the **`[locale]` URL segment + next-intl** runtime spine ([ADR-0009](../../../adr/0009-runtime-locale-authority-app-router.md)).
- Keep **translation supply** under [ADR-0005](../../../adr/0005-continuous-localization-operating-model.md): catalogs in repo, `pnpm i18n:compile`, `pnpm i18n:validate`, merge gates.
- Prove round-trip compatibility (nested keys, ICU, locale tags such as `zh-CN`) before wiring CI sync.

## Non-goals (this phase)

- **No** live production fetch of runtime strings from Tolgee.
- **No** production Tolgee API key in the browser (`NEXT_PUBLIC_*` key exposure).
- **No** unreviewed Tolgee dumps directly into `catalogs/fallback` or flat `catalogs/generated/<locale>.json` on `main`.

## Documentation links

| Topic                       | URL                                                                        |
| --------------------------- | -------------------------------------------------------------------------- |
| Tolgee docs (hub)           | https://docs.tolgee.io/                                                    |
| next-intl + App Router      | https://docs.tolgee.io/js-sdk/integrations/react/next/app-router-next-intl |
| In-context / dev tooling    | https://docs.tolgee.io/js-sdk/4.x.x/in_context                             |
| Tolgee Platform (self-host) | https://github.com/tolgee/tolgee-platform                                  |

**Cookie-based App Router variant** (not Afenda’s model): https://docs.tolgee.io/js-sdk/integrations/react/next/app-router — listed for awareness only; Afenda follows URL-segment locale per ADR-0009.

## Secret contract

**Minimum for tooling:** `TOLGEE_API_KEY` (Personal Access Token or project-scoped key — see [Tolgee API authentication](https://docs.tolgee.io/api)). **Do not** commit keys.

Optional env (only when needed): **`TOLGEE_PROJECT_ID`** (often with PAT / REST paths), **`TOLGEE_API_URL`** (self-hosted only; Tolgee Cloud defaults in CLI), **`TOLGEE_CLI_FORMAT`** / **`TOLGEE_BRANCH`** — see [`tolgee.config.cjs`](../../../../tolgee.config.cjs).

**Banned in production frontend:** `NEXT_PUBLIC_TOLGEE_API_KEY`. Dev-only in-context may use `NEXT_PUBLIC_TOLGEE_API_URL` + feature flags — never ship a production API key to the browser.

## Catalog flow (governed)

Tolgee does **not** ship directly; **CI ships** after catalogs change in Git.

```txt
Tolgee export → staging (unreviewed)
→ normalize / validate (Afenda tooling)
→ explicit human review
→ promotion to catalogs/fallback OR flat catalogs/generated/<locale>.json
→ pnpm i18n:compile → messages/
```

Compile today reads flat `src/i18n/catalogs/generated/<locale>.json` per [ADR-0005](../../../adr/0005-continuous-localization-operating-model.md). If raw exports use a nested path (for example `generated/tolgee/<locale>.json`), a **normalize** step in follow-up scripts must merge into the compile contract or extend the catalog core—document the outcome of the spike below.

### PR 1 default for raw exports (until PR 2)

- **Preferred:** `src/i18n/catalogs/tolgee-staging/` for unreviewed Tolgee JSON—**gitignored** for local work (add pattern when first sync script lands), or commit only on **spike/feature branches**, never unreviewed onto `main`.
- **Alternative:** `src/i18n/catalogs/generated/tolgee/<locale>.json` if operators prefer nesting under `generated/`; PR 2 normalize must still flatten or merge into flat `generated/<locale>.json` for today’s compiler unless `i18n-catalog-core` is extended.

## PR 1B (spike task): Tolgee round-trip evidence

Small, **non-runtime** slice. Goal: prove Tolgee can round-trip a small Afenda-shaped catalog subtree without damaging shape or validation rules.

1. Use a **copied sample subtree** (or the [sample JSON](#sample-json-for-spike-payloads) below), not production catalog authority.
2. Import sample keys into Tolgee (project or test workspace).
3. Export JSON from Tolgee.
4. Normalize output locally if needed (document the delta).
5. Compare against expected Afenda catalog shape (nested objects, ICU strings, locale file naming).
6. Record results in [Spike results](#spike-results) (section below).
7. Run `pnpm i18n:validate` **only if** the exported artifact is placed into a path the validator exercises (e.g. after normalization into a disposable generated path on a branch); otherwise note “N/A” with reason.

**Constraints:** no Tolgee SDK in the app runtime; no changes to `request.ts`, `[locale]` layout, or `proxy`; no CI change. In-repo **`pnpm i18n:tolgee:spike-check`** is allowed (Afenda-only Node script; **no** Tolgee npm package).

**Canonical import payload (committed):** [`tolgee-spike-sample-canonical.json`](./tolgee-spike-sample-canonical.json) — use this file (or the same structure) when seeding Tolgee for the spike.

**After export:** run `pnpm i18n:tolgee:spike-check path/to/exported.json`. With no path, the command self-checks the canonical file (smoke). The script checks nested paths, string leaves, naive `{`/`}` balance on ICU-like strings, and unwraps a **single** top-level locale wrapper when the key looks like BCP-47 (e.g. `{ "zh-CN": { "common": … } }`). For other Tolgee shapes, normalize first, then re-run the check.

## Tolgee CLI + config

Uses **`@tolgee/cli`** via **`pnpm i18n:tolgee:cli`** ([`scripts/tolgee-cli.mjs`](../../../../scripts/tolgee-cli.mjs)), env merge via [`tolgee-load-env.mjs`](../../../../scripts/tolgee-load-env.mjs), and **[`tolgee.config.cjs`](../../../../tolgee.config.cjs)** aligned with [Tolgee CLI project configuration](https://docs.tolgee.io/tolgee-cli/project-configuration) (`$schema`, `pull`/`push`, no committed `apiKey`).

| Command                                                                                     | Purpose                                                                                                                               |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm i18n:tolgee:cli -- pull` / `push` / `sync` / `extract` / `compare` / `tag` / `branch` | See [Tolgee CLI](https://docs.tolgee.io/tolgee-cli).                                                                                  |
| `pnpm i18n:tolgee:discover`                                                                 | Optional: list projects (`GET /v2/projects`) — **PAT** only; project keys → **`pnpm i18n:tolgee:discover -- <projectId>`** if needed. |
| `pnpm i18n:tolgee:cli:push-spike`                                                           | Push canonical EN sample (`--force-mode KEEP`), then pull.                                                                            |
| `pnpm i18n:tolgee:normalize`                                                                | Map Tolgee JSON → `catalogs/generated/` (see [Normalize](#normalize-tolgee-export--generated-catalogs)).                              |

If **`pull`** returns **`no_exported_result`**, add keys (UI or `push-spike`) then retry. Platform features (MT, TM, webhooks, etc.): [Tolgee REST API](https://docs.tolgee.io/api).

## REST export (`pnpm i18n:tolgee:pull`)

Minimal GET export — `env.config` + `.env.local` via `tolgee-load-env` (parent `with-env-config` for the pnpm entry).

**Requires** **`TOLGEE_API_KEY`** only; **`TOLGEE_PROJECT_ID`** optional for path-style export; **`TOLGEE_API_URL`** only when not Tolgee Cloud. No key → exit **0** skip.

**Usage:** `pnpm i18n:tolgee:pull` with **no** `--languages` exports every locale that has **exported content**. With `--languages=<tag>` (repeatable), the tag must match **Project → Languages** in Tolgee (often **`zh-Hans`**, **`zh-Hans-CN`**, or **`zh`**, not necessarily **`zh-CN`** from [`locale-registry.ts`](../../../../src/i18n/locale-registry.ts)). Map Tolgee stems → Afenda locales in [`tolgee-locale-map.json`](../../../../src/i18n/tolgee-locale-map.json); see [Normalize](#normalize-tolgee-export--generated-catalogs).

**`no_exported_result` (HTTP 400):** Usually means **no translations exist yet** for that language (adding a language ≠ having strings). Translate at least one key in Tolgee for that column, then re-run; or omit `--languages` and inspect the ZIP — until Chinese strings exist, the ZIP may contain only **`en.json`**.

Output defaults to **`src/i18n/catalogs/tolgee-staging/`** (gitignored). Tolgee often returns **JSON** for a single file or a **ZIP** for multiple locales.

**API:** [Export data](https://docs.tolgee.io/api/export-data) — `/v2/projects/export` (no id) or `/v2/projects/:projectId/export`.

## Normalize Tolgee export → generated catalogs

**Script:** `pnpm i18n:tolgee:normalize` ([`scripts/tolgee-normalize.mjs`](../../../../scripts/tolgee-normalize.mjs)).

1. Pull or unzip so **one folder** contains per-locale exports (`en.json`, `zh-Hans-CN.json`, …). Default input is **`src/i18n/catalogs/tolgee-staging/`** — override with `--input=relative/path`.
2. Edit **[`src/i18n/tolgee-locale-map.json`](../../../../src/i18n/tolgee-locale-map.json)** — `tolgeeTagToCatalogLocale` maps **Tolgee file stem** → **`catalogLocale`** in [`locale-registry.ts`](../../../../src/i18n/locale-registry.ts) (e.g. `zh-Hans-CN` → `zh-CN`).
3. **Dry-run (default):** prints planned writes only.
4. **Write:** `I18N_ALLOW_GENERATED_UPDATE=1 pnpm i18n:tolgee:normalize -- --write` — writes **`catalogs/generated/<locale>.json`** aligned to **`catalogs/source/en.json`** (drops unknown keys; fills gaps from English shape via [`alignLocaleCatalogToCanonicalShape`](../../../../scripts/lib/i18n-catalog-core.mjs)).
5. **English:** Tolgee **`en.json`** is **not** applied (canonical English stays **`catalogs/source/en.json`**).

Then **`pnpm i18n:compile`** and **`pnpm i18n:validate`**. Human review before merging generated commits on `main` per ADR-0010.

## GitHub Actions (optional)

Workflow **[`.github/workflows/tolgee-i18n.yml`](../../../../.github/workflows/tolgee-i18n.yml)** runs on **`workflow_dispatch`** and weekly (**`schedule`**). It executes **`pnpm i18n:tolgee:ci`** (pull → unzip → normalize → `pnpm i18n:compile` → `pnpm i18n:validate`).

**Repository secret:** add **`TOLGEE_API_KEY`** (project API key or PAT) in **Settings → Secrets and variables → Actions**. If the secret is **missing** or **empty**, the job is **skipped** (no CI failure for forks and optional adoption).

**Not included:** auto-commit of `catalogs/generated` or `messages/` (ship path stays human/PR review per ADR-0010). The workflow **verifies** the pipeline end-to-end in a clean runner.

## Tolgee automation dry-run

Validated the Tolgee pull command **without** credentials.

**Results:**

- `pnpm i18n:tolgee:pull` **skipped as expected** when **`TOLGEE_API_KEY`** is unset (exit 0).
- `pnpm eslint scripts/tolgee-export-pull.mjs` exited **0**.

This confirms **safe optional behavior** for CI and local dev when Tolgee credentials are absent.

**Credentialed spike:** Done — see [Spike results](#spike-results).

**Handoff:** PR 1B complete. To see Chinese in exports: translate strings in Tolgee for your chosen Chinese language column, then **`pnpm i18n:tolgee:pull`** (full) or **`--languages=<exact Tolgee tag from Project → Languages>`**.

## Round-trip spike checklist (procedure)

Run on a **branch** or local copy; do not merge unreviewed Tolgee bytes into protected catalogs on `main`.

1. **Nested keys** survive import/export (structure matches `next-intl` message shape).
2. **ICU** placeholders survive (plural, select, variables).
3. **Rich-text** placeholders survive **if** the product uses them in messages.
4. Locale code **`zh-CN`** survives exactly (no silent normalization to another tag unless intentional).
5. **Empty / missing** translations do not become English silently unless that is an explicit product policy.
6. **Export order/format** is acceptable or normalized by Afenda tooling (document gaps).
7. **`pnpm i18n:validate`** passes after normalization / promotion path used in the spike (when applicable).

### Sample JSON for spike payloads

Representative keys (simple labels, plural ICU, audit-style variables):

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "tenant": {
    "selectTitle": "Select organization",
    "membersCount": "{count, plural, one {# member} other {# members}}"
  },
  "audit": {
    "recordCreatedBy": "{actor} created this record at {timestamp}"
  },
  "formatting": {
    "richLine": "Tap <accent>{product}</accent> for {action, select, upgrade {upgrade} other {details}}"
  }
}
```

## Spike results

| Check                                              |     Result     | Notes                                                                                                                                                                                                                                                                                       |
| -------------------------------------------------- | :------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nested keys preserved                              |      Pass      | `pnpm i18n:tolgee:cli:push-spike` → `pnpm i18n:tolgee:pull -- --languages=en` → unzip → `pnpm i18n:tolgee:spike-check` on `en.json` (matches canonical nested paths).                                                                                                                       |
| ICU placeholders preserved                         |      Pass      | Same path; spike-check reports leaf ICU markers OK.                                                                                                                                                                                                                                         |
| Plural ICU preserved                               |      Pass      | Sample includes `tenant.membersCount` plural rule.                                                                                                                                                                                                                                          |
| Rich-text placeholder syntax preserved             |      Pass      | Canonical `formatting.richLine` uses angle-bracket segments + ICU `select`; survives round-trip and spike-check.                                                                                                                                                                            |
| `zh-CN` locale filename/code preserved             |      Pass      | REST `languages=zh-CN` is accepted by the API. With **no `zh-CN` content** in the Tolgee project, export returns **`no_exported_result`** (HTTP 400) — **detectable**, not silent mis-tag. Add `zh-CN` in Tolgee + translate to obtain `zh-CN.json` in a ZIP (optional operator follow-up). |
| Missing translations remain detectable             |      Pass      | Empty/unready locale surfaces as export error or empty state in TMS; Afenda does not merge Tolgee output into runtime without review.                                                                                                                                                       |
| Export can be normalized into Afenda catalog shape |      Pass      | REST export usable as JSON; ZIP → per-locale files; same nested object shape as canonical.                                                                                                                                                                                                  |
| `pnpm i18n:validate` passes after normalization    | N/A / baseline | Tolgee staging is **not** on the catalog compile path until promote-to-generated; **Recorded:** `pnpm i18n:validate` **passes** on repo `main` catalogs. Normalize + CI pipeline implemented — see [Tolgee operating model closure](#tolgee-operating-model-closure).                       |

There are no **Pending** spike rows.

**Date / operator / Tolgee version (optional):**

- 2026-04-28 — credentialed round-trip (project API key via `PROJECT_API_KEY` → `TOLGEE_API_KEY` mapping in `tolgee-load-env.mjs`; no `TOLGEE_PROJECT_ID` required for Cloud project key).
- 2026-04-28 — spike **closed**: extended canonical sample (`formatting.richLine`), re-push, re-pull, spike-check OK; `zh-CN` empty-locale behavior recorded; `pnpm i18n:validate` baseline recorded.

## Closure (documentation slice)

This note, together with [ADR-0010](../../../adr/0010-tolgee-localization-operations-platform.md), completes the **documentation and governance decision slice** for Tolgee as a proposed localization operations platform.

**Engineering integration** (normalize, locale map, optional CI) is **complete** — see [Tolgee operating model closure](#tolgee-operating-model-closure) for what remains (operators / ADR Accepted / single TMS).

**Validated:**

- `pnpm doctrine:check`
- `pnpm i18n:validate`
- `pnpm type-check`
- `pnpm repo:guard`
