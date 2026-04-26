# ATC-0004: Environment and Script Command Contract

## Acceptance Criteria

- `package.json` remains the source of truth for executable scripts.
- User-facing script documentation in README, CONTRIBUTING, and AGENTS matches the current command contract.
- `env.config` remains the maintained local environment source.
- `.env.local` remains generated from `env.config` and ignored by git.
- Unsafe commands are clearly named and documented as unsafe.
