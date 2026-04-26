# 0005: Database Migration Safety

## Rule

Database changes must flow through reviewed Drizzle migrations.

Applied baseline migrations must not be rewritten to change history. If an existing database needs structural change, add a new migration or perform an explicitly reviewed operational migration.

## Safety Requirements

- Use `DATABASE_URL_DIRECT` for schema migrations and DDL when available.
- `db:push` must remain gated away from direct schema push behavior.
- Any forced schema push must stay clearly named as unsafe and limited to local or disposable environments.
- Governance-only work must not execute live database migrations or mutate live Neon state.
- Migration SQL must target the current application schema and must not reintroduce deprecated schema names.

## Implications

- Migration history is part of production state and review scope.
- Fresh databases and existing databases must converge through migrations, not edited history.
- Live database repair requires explicit operational approval outside documentation-governance work.
