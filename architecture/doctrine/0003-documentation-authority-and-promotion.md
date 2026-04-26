# 0003: Documentation Authority and Promotion

## Rule

Current engineering authority lives in `architecture/doctrine/`, `architecture/adr/`, and `architecture/atc/`.

`architecture/docs/` is a deprecated tombstone. Removed historical docs may be recovered from git history as input for future work, but they are not authoritative until the relevant rule, decision, or acceptance contract is promoted.

## Promotion Model

- Promote durable operating rules into `architecture/doctrine/`.
- Promote consequential architecture choices into `architecture/adr/`.
- Promote enforceable pass/fail expectations into `architecture/atc/`.
- Do not recreate broad stale reference docs in `architecture/docs/`; recover historical material from git history only when needed.
- When deprecated docs conflict with code or authority records, current code and authority records win.

## Implications

- Top-level docs must not describe `architecture/docs/` as the source of truth.
- `pnpm doctrine:check` protects the authority model itself.
- New enforcement belongs in `repo:guard` only after an ATC defines the contract.
