# ADR-0006: In-app documentation — generated navigation, git-first model, and continuous localization (future)

## Status

Accepted

## Context

In-app help is shipped as Markdown in the repository and rendered in the Next.js app. Previously, the sidebar and prev/next order were duplicated: each English page had frontmatter (`section`, `order`) while `docs-navigation.ts` also listed the same slugs, `titleKey`s, and ordering. That duplication caused drift and did not match the **continuous localization** workflow used for application UI strings ([ADR-0005](./0005-continuous-localization-operating-model.md)), which scales by keeping a **single** English source and automating non-English output.

A separate, fully dynamic headless CMS was rejected as the **default** for the current product phase: the team is small, docs change with the same PRs as code, and CI already validates docs structure. A CMS remains a **future** option when non-engineer authors or publish-on-demand help without a deploy is required.

## Decision

1. **Git-first, English-canonical** — Canonical documentation remains under `src/features/docs/content/en/`. The loader still resolves translated files per locale and falls back to English when [allowed fallbacks](../../src/i18n/README.md) or translated files are missing.

2. **Generated page manifest** — `src/features/docs/lib/docs-nav-pages.generated.json` is **generated** from English frontmatter (`section`, `order`, `navTitleKey`) by `pnpm docs:generate-nav`. The CLI fails with `--check` if the file is out of date. `pnpm docs:check` runs the generator in check mode first, then the structural validator.

3. **Stable section metadata** — Section order, i18n keys for section headers, and Lucide icons are maintained in a small, explicit module: `src/features/docs/lib/docs-nav-sections.config.ts`. This file does not list individual page slugs.

4. **Runtime** — `docs-navigation.ts` builds the `docSections` array from the generated JSON plus `sectionNavConfig` (no hand-maintained per-page list).

5. **Future alignment with ADR-0005 (docs in Crowdin or another TMS)** — Proposed, not yet implemented:
   - **Input**: English `.md` remains the developer-authored source in git, or a CI job uploads English **strings or files** to a localization project separate from, or parallel to, `catalogs/source/en.json`.
   - **Output**: A pull request (or the same `i18n:platform:download` style job) **imports** translated Markdown into `src/features/docs/content/<locale>/` on a known cadence. Merge gates reuse `pnpm docs:check`, `pnpm docs:hash:write` (sync `translation.sourceHash` from English), and `pnpm docs:generate-nav --check` as today.
   - **Translation metadata**: The current `translation.sourceHash` in localized frontmatter ties each translation to a canonical body hash. If a TMS became the system of record for "approved" alignment, ADR-0005-style governance could **simplify** this (for example, binding to platform export id + timestamp instead of per-file hashes) — that would be a follow-on ADR once a platform and policy are agreed.

6. **Optional long term** — A **headless CMS** (Contentful, Sanity, Contentlayer-style git CMS, and so on) is reserved for the case where documentation is owned outside engineering or must publish on a different cadence than the application. The app would fetch help content at build or via ISR; navigation could still be driven by a **manifest** endpoint or a generated file from the CMS's schema.

## Consequences

- Adding or reordering a public doc page: update **one** place — the English file's `section`, `order`, and `navTitleKey`, then run `pnpm docs:generate-nav` and commit the JSON.
- CI fails if a developer forgets to regenerate the nav manifest.
- The operating model is explicitly documented: **UI strings** follow [ADR-0005](./0005-continuous-localization-operating-model.md) (Crowdin → generated catalogs); **in-app help** stays file-based in git with a clear path to TMS and optional CMS, without forking the mental model in [`src/i18n/README.md`](../../src/i18n/README.md) guidance.

## References

- [`src/i18n/README.md`](../../src/i18n/README.md) — full docs and i18n validation commands
- [ADR-0005](./0005-continuous-localization-operating-model.md) — continuous localization for runtime messages
