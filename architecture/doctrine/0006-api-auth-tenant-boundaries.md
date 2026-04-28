# 0006: API, Auth, and Tenant Boundaries

## Rule

Tenant-scoped behavior must be resolved server-side and must enforce tenant access at the API/service boundary.

Auth.js session data identifies the user. Tenant membership, permissions, and tenant-specific access must be resolved from trusted server-side data, not from client input alone.

## Boundary Rules

- App routes should stay thin and delegate business behavior to feature or shared server modules.
- Tenant route parameters must be treated as untrusted input until validated.
- API routes must return explicit authorization or not-found responses instead of leaking tenant existence or cross-tenant data.
- Client components may render and orchestrate interaction, but authorization decisions belong on the server.
- Shared auth and tenant helpers should remain under stable `@/shared/*` subpaths.

## Implications

- UI gating is not sufficient access control.
- Cross-tenant reads and writes are architecture violations.
- Future enforcement can target import direction and server/client bundle boundaries, but this doctrine does not add product behavior by itself.

## Subdomain tenancy: cookies and routing (alignment with ADR 0008)

- URL locale remains canonical for localized routes; the locale cookie is a **preference / detection** helper.
- For `{slug}.{TENANT_ROOT_DOMAIN}`, **session** and **NEXT_LOCALE** cookie `Domain` should follow the same deploy topology when operators intend shared login + locale across subdomains (see ADR 0008 resolution order).
- **Server-only** validated environment must **not** be imported from modules that ship to the client for routing or cookie configuration; use `NEXT_PUBLIC_*` mirrors where the client bundle must agree (ADR 0008).
- `NEXT_PUBLIC_*` cookie-domain variables are **public** configuration (visible in the browser bundle); they are not secrets and must match deployed DNS; changing them requires **env sync and redeployment**.

## Tenant boundary checklist

- Tenant slug, subdomain, custom host (when introduced), and route params are **untrusted input** until validated against trusted server state.
- Tenant identity is established **only after** database lookup and membership / permission validation (`hasPermission`, role checks on mutations and APIs).
- **URL locale** (the `[locale]` segment) and **tenant identity** are separate concerns; do not conflate them in authorization logic.
- The locale cookie is a **preference / detection** helper; it must not override `[locale]` as the canonical localized route authority.
- Auth/session cookie domain and locale cookie domain **must align** for subdomain tenancy when operators intend shared sessions across tenant hosts (see ADR 0008).
- **Edge / proxy** logic (`src/proxy.ts`) may normalize host and path and set non-authoritative hints (for example `x-pathname`, `x-tenant-slug`); it **must not** authorize tenant access. **Proxy routes; proxy does not authorize.**
- **Self-service first organization** (`ENABLE_SELF_SERVICE_TENANT_CREATE`): tenant and membership rows are created only in **server** modules (server action → service); the flag is enforced server-side; slug and reserved-label checks are not a substitute for **database uniqueness**—map known `23505` failures to user-safe errors at the persistence boundary.
- **Session vs DB after membership changes**: Auth.js session `user.roles` (JWT path) can lag the database until the session is refreshed; flows that add the first membership must trigger a client-visible refresh (`useSession().update`) and a **`jwt` callback refresh** on `trigger === 'update'` so tenant path hints and server truth stay aligned.
- **Subdomain host → pathname rewrite** (`resolveTenantSlugFromIncomingRequest`, `buildTenantHostRewritePathname`) is **routing math only**; it does not prove the slug exists or that the caller may access that tenant—always validate with trusted server state after rewrite.
- **Verified custom apex hostnames** (`tenants.custom_domain_hostname` when verified): routing may resolve the canonical tenant slug via an internal lookup bound to operator secrets (`ENABLE_CUSTOM_DOMAIN_ROUTING`, `MIDDLEWARE_TENANT_LOOKUP_SECRET`); the lookup answers hostname→slug only—membership and PBAC checks remain mandatory on servers and APIs.
