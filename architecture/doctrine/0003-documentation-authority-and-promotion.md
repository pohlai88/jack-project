# 0003: Documentation Authority and Promotion

## Rule

Current engineering authority lives in `architecture/doctrine/`, `architecture/adr/`, and `architecture/atc/`.

`architecture/docs/` is deprecated reference material. It may be used as input for future work, but it is not authoritative until the relevant rule, decision, or acceptance contract is promoted.

## Promotion Model

- Promote durable operating rules into `architecture/doctrine/`.
- Promote consequential architecture choices into `architecture/adr/`.
- Promote enforceable pass/fail expectations into `architecture/atc/`.
- Keep stale, aspirational, or removed behavior in `architecture/docs/` only as historical context.
- When deprecated docs conflict with code or authority records, current code and authority records win.

## Implications

- Top-level docs must not describe `architecture/docs/` as the source of truth.
- `pnpm doctrine:check` protects the authority model itself.
- New enforcement belongs in `repo:guard` only after an ATC defines the contract.
