# 0008: Test, CI, and Artifact Hygiene

## Rule

Vitest is the active test runner. Generated reports and tool outputs must not be committed.

CI and local verification should use package scripts so environment loading and repo governance remain consistent.

## Hygiene Rules

- Co-located tests stay beside source under `src/**/__tests__`.
- Root `tests/` is reserved for shared test support, types, and fixtures.
- Production source must not import test support.
- Legacy Jest dependencies, config, and APIs must not be reintroduced.
- Configurable reports and generated outputs belong under `.artifacts/` or another ignored output path.

## Implications

- `repo:guard` is the final CI authority for hygiene checks.
- ESLint may mirror fast local feedback, but it is not the final architecture verdict.
- Coverage and report paths must remain aligned with CI upload paths.
