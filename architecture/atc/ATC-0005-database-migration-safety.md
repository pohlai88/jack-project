# ATC-0005: Database Migration Safety

## Acceptance Criteria

- Schema changes are represented as reviewed Drizzle migrations.
- Applied baseline migrations are not rewritten as a substitute for a new migration.
- `db:push` remains gated away from direct unsafe push behavior.
- Forced schema push remains isolated behind an explicitly unsafe command.
- Migration SQL does not target deprecated application schema names.
- Governance-only changes do not execute live database migrations.
