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
