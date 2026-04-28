# ATC-0010: Locale Activation Readiness

## Acceptance Criteria

`RG-I18N-001 Locale Activation Readiness` defines a deterministic governance readiness contract for locale rollout.

For each locale, the readiness system must derive and report all of the following:

- `runtime_active`
- `messages_complete`
- `docs_evidence_generated`
- `ui_qa_done`
- `business_owner`
- `translation_reviewer`
- `technical_owner`
- `approval_date`
- `activation_verdict`

The readiness system must follow these rules:

- system truth comes from runtime config, message inventory, and generated docs evidence
- governance truth comes from the committed locale activation snapshot
- governance truth must never override system truth
- docs are generated from product truth and are not manually translated per locale
- locale activation must be config-driven; no hardcoded locale lists outside canonical i18n config are allowed unless explicitly documented and justified
- contributors (or automation) may propose changes via Git; repository validation and merge decide acceptance
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

- This ATC does not **by itself** change `activeLocales` in `src/i18n/locale-registry.ts` (that remains a product/registry change); it measures and reports readiness once the registry is updated.
- This ATC does not add locale-specific docs folders.
- This ATC does not change message loading behavior.
- This ATC does not promote readiness to a hard CI gate in this slice.
