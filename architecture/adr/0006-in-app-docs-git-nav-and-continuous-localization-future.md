# ADR-0006: Superseded legacy in-app documentation model

## Status

Superseded by the Afenda Documentation Evidence Pipeline.

## Context

This ADR described the former handcrafted Markdown docs system. That system has been removed.

## Decision

Afenda documentation is now generated from governed product truth:

- product manifests and registries are authoritative
- generated MDX/JSON under `docs/content/generated` is the docs evidence surface
- curated MDX under `docs/content/curated` may explain, but must not define product truth
- Fumadocs renders `/docs`
- Pagefind and Fumadocs search index generated evidence
- i18n governs runtime UI messages only; docs are not manually translated per locale

## Consequences

- Do not create or restore locale-specific docs Markdown folders.
- Do not use docs native translation as a locale activation gate.
- Use `pnpm docs:ci` for documentation evidence validation.
- Use `pnpm i18n:*` commands for runtime message validation.

## References

- [`src/i18n/README.md`](../../src/i18n/README.md) — runtime i18n operating model
- [ADR-0005](./0005-continuous-localization-operating-model.md) — continuous localization for runtime messages
