# ATC-0008: Test, CI, and Artifact Hygiene

## Acceptance Criteria

- Vitest remains the active test runner.
- Production source does not import shared test support.
- Legacy Jest dependencies, config, and APIs are not reintroduced.
- Generated reports and artifacts are ignored and untracked.
- CI uses package scripts for doctrine, repo guard, lint, type check, tests, and build.
