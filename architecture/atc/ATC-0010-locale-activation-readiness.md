# ATC-0010: Locale Activation Readiness

## Acceptance Criteria

`RG-I18N-001 Locale Activation Readiness` defines a deterministic governance readiness contract for locale rollout.

For each locale, the readiness system must derive and report all of the following:

- `runtime_active`
- `messages_complete`
- `docs_native`
- `fallback_approved`
- `ui_qa_done`
- `business_owner`
- `translation_reviewer`
- `technical_owner`
- `approval_date`
- `activation_verdict`

The readiness system must follow these rules:

- system truth comes from runtime config, message inventory, and docs structure
- governance truth comes from the committed locale activation snapshot
- governance truth must never override system truth
- visible English fallback is allowed only if declared and approved
- locale activation must be config-driven; no hardcoded locale lists outside canonical i18n config are allowed unless explicitly documented and justified
- translation tools may propose changes; repository validation and merge decide acceptance
- activation verdicts must be derived algorithmically using the strict taxonomy:
  - `canonical`
  - `active_ready`
  - `active_fallback`
  - `inactive_draft`

## Warn-Only Status

This ATC is warn-only in the current slice.

- the readiness report may emit warnings and generate artifacts
- the default report mode must exit `0`
- future enforced mode may exit non-zero without redesigning the verdict model

## Non-Goals

- This ATC does not change runtime locale activation.
- This ATC does not add or remove docs folders.
- This ATC does not change message loading behavior.
- This ATC does not promote readiness to a hard CI gate in this slice.
