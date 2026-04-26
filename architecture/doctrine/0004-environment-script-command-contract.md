# 0004: Environment and Script Command Contract

## Rule

`package.json` is the source of truth for executable project scripts.

`env.config` is the maintained local environment source. `.env.local` is generated from it by `pnpm env:sync` and must not be edited manually as the durable source.

## Command Contract

- Scripts that run application code should load the managed environment through `scripts/with-env-config.mjs` unless they intentionally operate outside runtime configuration.
- README, CONTRIBUTING, and AGENTS must describe current package scripts accurately.
- Lifecycle scripts such as `prepare` are not user-facing commands and do not need to be documented as normal workflows.
- Commands that are intentionally unsafe must be named and described as unsafe.

## Implications

- Package-script drift is an architecture concern, not only documentation cleanup.
- Future enforcement should compare documented user-facing commands against `package.json`.
- Generated environment adapters must remain ignored and reproducible from `env.config`.
