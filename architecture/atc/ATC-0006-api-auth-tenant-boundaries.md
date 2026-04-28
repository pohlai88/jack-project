# ATC-0006: API, Auth, and Tenant Boundaries

## Acceptance Criteria

- Tenant-scoped APIs validate tenant access on the server.
- Route parameters and client input are not trusted as authorization proof.
- App route files stay thin and delegate business logic to feature or shared server modules.
- Authorization failures do not leak cross-tenant data.
- Client components do not become the only enforcement point for access control.
- Middleware / proxy may normalize host and path but must not be treated as the source of tenant authorization; tenant identity still requires server-side validation (see doctrine 0006 tenant boundary checklist).
- Pure helpers used for subdomain rewrite and locale selection (`tenant-subdomain-host`, locale cookie resolution) must remain covered by unit tests so proxy behavior does not drift without review; those tests assert pathname math and cookie/header precedence, not authorization.
