---
reviewed_by: Codex governance bootstrap
last_reviewed_date: '2026-04-27'
source_artifact_hash: 6b0c867f7ab697703a5a01f7801cf86b6630857bd0633255dc23e06483b97976
locales:
  en:
    language_name: English
    runtime_active: true
    messages_complete: true
    docs_native: true
    fallback_approved: false
    ui_qa_done: true
    business_owner: TBD
    translation_reviewer: TBD
    technical_owner: TBD
    approval_date: TBD
    activation_verdict: canonical
    notes: Canonical source locale.
  es:
    language_name: Español
    runtime_active: true
    messages_complete: true
    docs_native: true
    fallback_approved: false
    ui_qa_done: true
    business_owner: TBD
    translation_reviewer: TBD
    technical_owner: TBD
    approval_date: TBD
    activation_verdict: active_fallback
    notes: Native docs and UI QA are complete; governance ownership and approval are still pending, preventing promotion to active_ready.
  vi:
    language_name: Tiếng Việt
    runtime_active: true
    messages_complete: true
    docs_native: false
    fallback_approved: true
    ui_qa_done: false
    business_owner: TBD
    translation_reviewer: TBD
    technical_owner: TBD
    approval_date: TBD
    activation_verdict: active_fallback
    notes: Runtime active with approved visible English docs fallback.
  ms:
    language_name: Bahasa Melayu
    runtime_active: true
    messages_complete: true
    docs_native: false
    fallback_approved: true
    ui_qa_done: false
    business_owner: TBD
    translation_reviewer: TBD
    technical_owner: TBD
    approval_date: TBD
    activation_verdict: active_fallback
    notes: Runtime active with approved visible English docs fallback.
  zh-CN:
    language_name: 简体中文
    runtime_active: true
    messages_complete: true
    docs_native: false
    fallback_approved: true
    ui_qa_done: false
    business_owner: TBD
    translation_reviewer: TBD
    technical_owner: TBD
    approval_date: TBD
    activation_verdict: active_fallback
    notes: Runtime active with approved visible English docs fallback; visual QA remains pending, and this is the primary risk surface for activation readiness.
  id:
    language_name: Bahasa Indonesia
    runtime_active: false
    messages_complete: true
    docs_native: false
    fallback_approved: false
    ui_qa_done: false
    business_owner: TBD
    translation_reviewer: TBD
    technical_owner: TBD
    approval_date: TBD
    activation_verdict: inactive_draft
    notes: Draft locale inventory only.
  th:
    language_name: ไทย
    runtime_active: false
    messages_complete: true
    docs_native: false
    fallback_approved: false
    ui_qa_done: false
    business_owner: TBD
    translation_reviewer: TBD
    technical_owner: TBD
    approval_date: TBD
    activation_verdict: inactive_draft
    notes: Draft locale inventory only.
---

# I18N Locale Activation Snapshot

This reviewed snapshot captures the current governance readiness state for locale activation.

## Evidence Integrity

- `reviewed_by`: `Codex governance bootstrap`
- `last_reviewed_date`: `2026-04-27`
- `source_artifact_hash`: see frontmatter; this must match the generated markdown report under `.artifacts/i18n/`

## Current Snapshot

| Locale | Runtime Active | Messages Complete | Docs Native | Fallback Approved | UI QA Done | Owners Complete | Approval Date | Snapshot Verdict |
| ------ | -------------- | ----------------- | ----------- | ----------------- | ---------- | --------------- | ------------- | ---------------- |
| en     | yes            | yes               | yes         | no                | yes        | no              | TBD           | canonical        |
| es     | yes            | yes               | yes         | no                | yes        | no              | TBD           | active_fallback  |
| vi     | yes            | yes               | no          | yes               | no         | no              | TBD           | active_fallback  |
| ms     | yes            | yes               | no          | yes               | no         | no              | TBD           | active_fallback  |
| zh-CN  | yes            | yes               | no          | yes               | no         | no              | TBD           | active_fallback  |
| id     | no             | yes               | no          | no                | no         | no              | TBD           | inactive_draft   |
| th     | no             | yes               | no          | no                | no         | no              | TBD           | inactive_draft   |
