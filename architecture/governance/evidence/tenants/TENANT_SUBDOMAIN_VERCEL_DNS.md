# Tenant subdomains: DNS and Vercel (phase 5 operator notes)

Evidence for multi-tenant host routing (`TENANT_ROOT_DOMAIN`, `src/proxy.ts`) and production DNS. **ADR:** [0008-cookie-domain-tenant-subdomains.md](../../../adr/0008-cookie-domain-tenant-subdomains.md). Not a product ADR by itself.

## Afenda production: `nexuscanon.com`

| Piece                                                  | Choice                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vercel project domains**                             | `www.nexuscanon.com` (canonical app/auth origin), `*.nexuscanon.com` (tenant `{slug}` hosts). **Do not** attach bare apex `nexuscanon.com` to this project — it duplicates traffic/options and adds dashboard noise. If it appears (e.g. auto-added), remove it with `VERCEL_TOKEN=… pnpm vercel:domain:remove-apex` (see `scripts/remove-vercel-apex-domain.mjs`). |
| **`AUTH_URL` / `NEXT_PUBLIC_APP_URL`**                 | `https://www.nexuscanon.com` — single origin for Auth.js and OAuth redirects (not per-tenant hostnames).                                                                                                                                                                                                                                                            |
| **`TENANT_ROOT_DOMAIN`**                               | `nexuscanon.com` — enables `https://{slug}.nexuscanon.com` → locale + `/t/{slug}` in `src/proxy.ts`.                                                                                                                                                                                                                                                                |
| **`NEXT_PUBLIC_TENANT_ROOT_DOMAIN`**                   | Same as `TENANT_ROOT_DOMAIN` so client routing and `NEXT_LOCALE` agree with server (ADR 0008).                                                                                                                                                                                                                                                                      |
| **`AUTH_COOKIE_DOMAIN` / `NEXT_PUBLIC_COOKIE_DOMAIN`** | Optional but recommended for shared login across `www` and tenant subdomains: `nexuscanon.com` (registrable apex; never `*.vercel.app`).                                                                                                                                                                                                                            |

DNS (registrar): point **`www`** and **wildcard** `*.nexuscanon.com` per Vercel instructions. Apex `nexuscanon.com` DNS may point to a registrar parking page, another host, or Vercel — it does **not** need to be a **project domain** on this deployment when using `www` as `AUTH_URL`.

Copy-ready env keys live in **`env.config.example`** under “Production — nexuscanon.com”.

## Public `NEXT_PUBLIC_*` cookie-domain variables

These are **public deploy-time configuration** (bundled into browser JavaScript). They are **not secrets**. They must match the deployed domain topology. Changing them requires **`pnpm env:sync` and a new deployment** so the client bundle picks up new values.

`pnpm env:sync` prints **warnings** when `TENANT_ROOT_DOMAIN` and the `NEXT_PUBLIC_*` mirrors look inconsistent.

## Do not use provider preview roots for shared `Domain`

**Do not** configure a shared cookie `Domain` of `vercel.app` or any `*.vercel.app` host. That would be wrong and unsafe. Preview deployments should use **host-only cookies** or a **dedicated staging root** you control (for example `preview.afenda.dev` with matching `TENANT_ROOT_DOMAIN` / `NEXT_PUBLIC_*`).

The app also **refuses** to apply shared cookie `Domain` to `vercel.app`, IPv4 literals, and typical mDNS `.local` names (see `isUnsafeSharedCookieDomain` in `src/shared/lib/auth-cookie-domain.ts`).

## Environment matrix (expected cookie behavior)

| Environment                     | Auth / server domain inputs                                                       | Public cookie-domain inputs                                                               | Expected result                                                              |
| ------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Localhost                       | unset                                                                             | unset                                                                                     | Host-only cookies                                                            |
| Vercel preview (`*.vercel.app`) | usually unset                                                                     | usually unset                                                                             | Host-only cookies; no tenant host rewrite on `.vercel.app`                   |
| Staging custom root             | `TENANT_ROOT_DOMAIN=staging.example.com`, optional `AUTH_COOKIE_DOMAIN`           | `NEXT_PUBLIC_TENANT_ROOT_DOMAIN=staging.example.com` (or `NEXT_PUBLIC_COOKIE_DOMAIN`)     | Shared across staging tenant subdomains when safe host                       |
| Production                      | `TENANT_ROOT_DOMAIN=example.com`, optional `AUTH_COOKIE_DOMAIN`                   | `NEXT_PUBLIC_TENANT_ROOT_DOMAIN=example.com` (or `NEXT_PUBLIC_COOKIE_DOMAIN`)             | Shared across production tenant subdomains                                   |
| Afenda prod (`nexuscanon.com`)  | `TENANT_ROOT_DOMAIN=nexuscanon.com`, optional `AUTH_COOKIE_DOMAIN=nexuscanon.com` | `NEXT_PUBLIC_TENANT_ROOT_DOMAIN=nexuscanon.com` (or matching `NEXT_PUBLIC_COOKIE_DOMAIN`) | Same as generic production row; app/auth origin `https://www.nexuscanon.com` |

Use normalized hostnames (`example.com`), not `https://example.com` or a leading dot; `normalizeCookieDomainInput` strips common mistakes.

## DNS

1. Decide the **tenant root label** (e.g. `app.example.com` or `example.com`). Tenant hosts look like `{slug}.{TENANT_ROOT_DOMAIN}`.
2. Point the **apex** (and `www` if used) to Vercel per Vercel project docs (A/ALIAS/CNAME as required).
3. Add a **wildcard** record for tenant hosts, e.g. `*.{TENANT_ROOT_DOMAIN}` → Vercel, when every first label is a tenant slug. Omit or narrow if you use a dedicated subdomain zone (e.g. `*.t.example.com`).

## Vercel

1. Project **Settings → Domains**: add the apex and wildcard domain that match your DNS.
2. **Preview** (`*.vercel.app`): `src/proxy.ts` / `parseTenantSubdomainSlugFromHost` skips host-tenant mapping on `.vercel.app` to avoid slug collisions with deployment hostnames.

## Environment (align with `env.config.example`)

| Variable                                | Role                                                                                                                              |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `TENANT_ROOT_DOMAIN`                    | Server: subdomain detection + rewrite in `src/proxy.ts`.                                                                          |
| `NEXT_PUBLIC_TENANT_ROOT_DOMAIN`        | Same value as `TENANT_ROOT_DOMAIN` when you need **NEXT_LOCALE** (and client routing) to share cookie `Domain` across subdomains. |
| `NEXT_PUBLIC_COOKIE_DOMAIN`             | Optional explicit cookie apex; wins over `NEXT_PUBLIC_TENANT_ROOT_DOMAIN` in cookie resolution.                                   |
| `AUTH_URL`                              | Single canonical origin for Auth.js / OAuth callbacks (not per-tenant host).                                                      |
| `AUTH_COOKIE_DOMAIN` / server fallbacks | Session cookie `Domain` (see `src/shared/lib/auth-cookie-domain.ts`).                                                             |

## Auth0 (or other OIDC)

Register **callback / logout / web origins** for the **AUTH_URL** host only (e.g. `https://app.example.com/api/auth/callback/auth0`). OAuth returns to that host; tenant context continues to come from path or subdomain rewrite.

## Optional automation

`@vercel/sdk` is available in the repo for **scripts or internal APIs** (e.g. attaching a verified custom domain to a project). Do not depend on it from Edge `src/proxy.ts`; keep the proxy DB-free and fast.
