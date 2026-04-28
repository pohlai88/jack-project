# next-intl best-practice audit (Context7 + codebase)

**Date:** 2026-04-27 (initial), **re-run:** Context7 MCP  
**App stack:** Next.js 16, `next-intl` ^4.9.1 (root `package.json`).  
**Context7:** Retrieved via Cursor MCP **`user-context7`** (see `~/.cursor/mcp.json` → `https://mcp.context7.com/mcp`).

---

## 1. Context7 library resolution

| Field                   | Value                                                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Query**               | `next-intl` — App Router, `getRequestConfig`, middleware, routing                                                                                                          |
| **Selected library ID** | `/amannn/next-intl`                                                                                                                                                        |
| **Rationale**           | Official `amannn/next-intl` repo on Context7; High reputation; ~372 snippets; best match for installed package. (Alternative indexed doc site: `/websites/next-intl_dev`.) |

---

## 2. Context7 `query-docs` excerpts (verbatim topics)

Sources below are **Context7-returned** pointers into the upstream next-intl docs tree (`github.com/amannn/next-intl/...`) plus `context7.com/amannn/next-intl/llms.txt`.

### 2a. App Router plugin, layout, static rendering

- **Custom `getRequestConfig` path:** `createNextIntlPlugin('./somewhere/else/request.ts')` — [docs/.../getting-started/app-router.mdx](https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/getting-started/app-router.mdx)
- **`setRequestLocale`:** Call after validating `locale` with `hasLocale` / `notFound()`; _“Enable static rendering”_; **must be called before** `useTranslations` or `getMessages`. Same file: [docs/.../routing/setup.mdx](https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/routing/setup.mdx)
- **Independence:** _“Must be called in every page and layout where you intend to enable static rendering since Next.js can render layouts and pages independently.”_
- **NextIntlClientProvider (static hint):** Blog note that explicitly providing `locale`, `now`, and `timeZone` on the provider can help static behavior vs dynamic-by-default — [docs/.../blog/next-intl-3-0.mdx](https://github.com/amannn/next-intl/blob/main/docs/src/pages/blog/next-intl-3-0.mdx) (validate against current v4; `timeZone` is already returned from `getRequestConfig` in this app).
- **Plugin API:** Minimum `createNextIntlPlugin()` and optional path — [docs/.../usage/plugin.mdx](https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/usage/plugin.mdx)

### 2b. Middleware, `localePrefix`, composition

- **`proxy.ts`:** Middleware lives in `proxy.ts` for Next.js 16 (`middleware.ts` before 16); `createMiddleware(routing)`; standard `matcher` excluding `api`, `trpc`, `_next`, `_vercel`, dotted static files — [docs/.../routing/middleware.mdx](https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/routing/middleware.mdx)
- **`localePrefix`:** `'always'` (default), `'as-needed'`, `'never'` with matcher/cookie/redirect implications — [docs/.../routing/configuration.mdx](https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/routing/configuration.mdx)
- **Composition:** Run `handleI18nRouting(request)`, then adjust response (headers, rewrites) — [context7.com/.../llms.txt](https://context7.com/amannn/next-intl/llms.txt) advanced middleware example

### 2c. Navigation, messages, errors

- **`createNavigation`:** `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` from `createNavigation(routing)` — [docs/.../routing/setup.mdx](https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/routing/setup.mdx), [llms.txt](https://context7.com/amannn/next-intl/llms.txt)
- **`useRouter`:** Push pathname, `query`, `replace(..., { locale: 'de' })` — [docs/.../routing/navigation.mdx](https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/routing/navigation.mdx)
- **Client `onError` / `getMessageFallback`:** Not serializable for RSC → wrap inner `NextIntlClientProvider` in a `'use client'` provider — [docs/.../usage/configuration.mdx](https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/usage/configuration.mdx)
- **Default-locale message fallback:** _“Not the recommended way”_ to use `getMessageFallback` for missing keys; **merge messages from the default locale with the current locale’s messages** before providing them — same configuration doc (Context7 pulled the “How can I use messages from another locale as a fallback?” subsection)

---

## 3. Cross-check: next-intl.dev (secondary)

| Topic                 | Public URL                                                       |
| --------------------- | ---------------------------------------------------------------- |
| App Router            | https://next-intl.dev/docs/getting-started/app-router            |
| Routing setup         | https://next-intl.dev/docs/routing/setup                         |
| Routing configuration | https://next-intl.dev/docs/routing/configuration                 |
| Request configuration | https://next-intl.dev/docs/usage/configuration                   |
| Middleware            | https://next-intl.dev/docs/routing/middleware                    |
| Server vs client      | https://next-intl.dev/docs/environments/server-client-components |

---

## 4. Aligned with Context7 / docs

- **Plugin + `getRequestConfig` path:** [next.config.mjs](../../../../next.config.mjs) — `createNextIntlPlugin('./src/i18n/request.ts')` (matches §2a custom path pattern).
- **Routing:** [src/i18n/routing.ts](../../../../src/i18n/routing.ts) — `defineRouting({ locales, defaultLocale })`; implicit **`localePrefix: 'always'`** per Context7 default (§2b).
- **Middleware:** [src/proxy.ts](../../../../src/proxy.ts) — `createMiddleware(routing)` in `proxy.ts`; matcher aligned with documented exclusions (no `trpc` segment — acceptable if unused).
- **Navigation:** [src/i18n/navigation.ts](../../../../src/i18n/navigation.ts) — `createNavigation(routing)` per §2c.
- **Request config:** [src/i18n/request.ts](../../../../src/i18n/request.ts) — `requestLocale`, `hasLocale`, `defaultLocale` fallback; dynamic `messages` import; **merge default locale messages** over active locale (matches §2c recommended approach vs using `getMessageFallback` for missing keys).
- **Layout:** [src/app/[locale]/layout.tsx](../../../../src/app/[locale]/layout.tsx) — `hasLocale` → `notFound()`, `setRequestLocale(locale)` before `getMessages()`, `generateStaticParams`, `NextIntlClientProvider` with `locale` + `messages` (matches §2a flow).
- **Composition:** `auth()` wraps handler that invokes `handleI18nRouting` then mutates response — matches §2b “compose after i18n” pattern.

---

## 5. Gaps / risks / follow-ups (prioritized)

### P0 — None

No blocking divergence from Context7’s core App Router + routing setup.

### P1 — Error handling (Context7 §2c)

- Server `onError` in [src/i18n/request.ts](../../../../src/i18n/request.ts) only logs in **development**; docs illustrate production branching (e.g. missing vs other errors) and tracking.
- **`onError` / `getMessageFallback` on client:** Context7 explicitly requires a **client** `NextIntlClientProvider` wrapper for these callbacks; otherwise Client Components rely on defaults.

### P2 — `setRequestLocale` coverage (Context7 §2a)

- Docs: call in **every** layout and page that must be statically rendered. Repo: only root [src/app/[locale]/layout.tsx](../../../../src/app/[locale]/layout.tsx). Revisit if you see per-segment static generation issues.

### P2 — `NextIntlClientProvider` props (Context7 §2a blog)

- Consider verifying whether passing **`timeZone`** / **`now`** explicitly on `NextIntlClientProvider` (in addition to `getRequestConfig`) still affects static vs dynamic behavior in **v4**; app already sets `timeZone` in `getRequestConfig`.

### P2 — Runtime merge vs compile (unchanged)

- Compile-time merge in [scripts/lib/i18n-catalog-core.mjs](../../../../scripts/lib/i18n-catalog-core.mjs) plus runtime merge in [src/i18n/merge-messages.ts](../../../../src/i18n/merge-messages.ts) remains **defense in depth**, consistent with §2c “merge default locale” guidance—not a doc violation.

### P2 — Message payload / CWV

- Context7 / docs: measure before optimizing; optional `pick` / nested providers for client subsets.

---

## 6. Org-specific strengths (not in next-intl docs)

- Canonical **en** source, optional **generated**, **protected fallbacks**, compile → `messages/`, **`pnpm i18n:sync`**, ICU validation, registry-driven tooling ([src/i18n/README.md](../../../../src/i18n/README.md), [scripts/lib/i18n-catalog-core.mjs](../../../../scripts/lib/i18n-catalog-core.mjs)).
- **Runtime locale authority (I18N-RUNTIME-001):** [Doctrine 0009](../../../../architecture/doctrine/0009-i18n-runtime-locale-authority.md) and [ADR-0009](../../../../architecture/adr/0009-runtime-locale-authority-app-router.md) — the **`[locale]`** URL segment is the sole **runtime** authority for App Router pages; `next-intl` (`request.ts`, root `[locale]` layout, provider) carries it. Preference layers (cookies, tenant default, profile, headers) are redirect/entrypoint concerns only and must not silently override a resolved localized route inside `getRequestConfig`. Translation **supply** remains [ADR-0005](../../../../architecture/adr/0005-continuous-localization-operating-model.md), distinct from **rendering** authority.

## 7. Module layout (Context7 + repo conventions)

Official next-intl examples often use a top-level `messages/` directory. This repository keeps **`src/i18n/`** as the single module boundary: `request.ts`, `routing.ts`, `navigation.ts`, `messages/*.json` (compiled), and `catalogs/{source,fallback,generated}/` together with the **Node compile/validate** scripts in `scripts/lib/i18n-catalog-core.mjs`. That layout matches Context7 guidance that `createNextIntlPlugin` can point at any `requestConfig` path and that messages may be colocated with code; the plugin option `srcPath` exists for monorepos but is unnecessary here.

**No relocation** to root `messages/` was done: it would churn imports, `I18N_PATHS`, catalog paths, and CI without user-facing benefit. Further optimization should stay inside this module (for example selective client messages) rather than introducing parallel trees.

---

## 8. Re-run instructions

1. MCP server id in tooling: **`user-context7`** (metadata `serverName: context7`).
2. `resolve-library-id` with `libraryName: "next-intl"` and a short `query`.
3. `query-docs` with `libraryId: "/amannn/next-intl"` (optionally **`/amannn/next-intl/<version>`** when Context7 lists a matching release).
4. Use `researchMode: true` on a second pass only if snippets are insufficient (API key may be required per Context7).
