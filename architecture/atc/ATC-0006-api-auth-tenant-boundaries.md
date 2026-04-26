# ATC-0006: API, Auth, and Tenant Boundaries

## Acceptance Criteria

- Tenant-scoped APIs validate tenant access on the server.
- Route parameters and client input are not trusted as authorization proof.
- App route files stay thin and delegate business logic to feature or shared server modules.
- Authorization failures do not leak cross-tenant data.
- Client components do not become the only enforcement point for access control.
