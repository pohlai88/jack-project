# 0003: Governance as Code and CI Authority

## Status

Accepted

## Context

The project has durable architecture rules that should be visible to humans and enforceable in CI. ESLint is useful for fast local feedback, but it is not expressive enough for every repo-level rule, especially documentation authority, artifact hygiene, generated file tracking, migration safety, and feature API shape.

## Decision

Use the doctrine, ADR, and ATC model for human-readable authority, and use `repo:guard` as the final CI authority for enforceable repo governance.

ESLint may mirror selected rules for local developer feedback, but it must not become the source of truth for architecture verdicts.

## Consequences

- Doctrine records define rules.
- ADRs explain consequential choices.
- ATCs define pass/fail contracts.
- `repo:guard` turns enforceable contracts into CI verdicts.
- ESLint remains useful but secondary local feedback.
- New governance rules should move through doctrine and ATC before adding repo-guard enforcement.
