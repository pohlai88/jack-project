# 0007: Docs Page Feedback Authority

## Status

Accepted

## Context

Afenda renders governed documentation through Fumadocs and needs page-level feedback without turning generated UI scaffolding into a new source of product truth.

## Decision

Fumadocs provides the feedback UI pattern; Afenda owns the feedback authority.

Feedback validation, origin checks, rate limiting, storage, and governance records live in Afenda-owned code under `src/docs/feedback/`. Feedback events are append-only database records, not mutable page state. Block-level MDX feedback remains out of scope until there is a proven review workflow for page-level feedback.

## Consequences

- Docs feedback implementation stays inside the docs module instead of root UI or orphan feature folders.
- Server Actions used for feedback are treated as public mutation entry points.
- Feedback data is stored as immutable events for auditability and future reporting.
- Fumadocs renderer concerns remain separate from Afenda evidence and governance concerns.
