# Directory Ownership Map (docs + i18n)

## Current boundary map

- `src/app/[locale]/docs`: Route surface and page assembly for localized docs pages.
  - Owns route segments, metadata composition, and page composition.
  - Must not read corpus files directly.
- `src/docs`: Fumadocs runtime/rendering domain.
  - Owns docs UI runtime integrations (layout helpers, OpenAPI/LLM/search glue, evidence rendering).
  - Accepts content only through `src/docs/runtime/source` and related runtime services.
- `content/i18n/docs`: Canonical localized documentation corpus.
  - Source-of-truth Markdown/MDX content for Fumadocs.
  - Includes `generated/`, `curated/`, and localized roots (`en`, `vi`, `ms`, `id`, `zh-CN`, ...).
- `src/i18n`: Runtime locale/message infrastructure only.
  - Owns routing authority, catalogs, and locale utilities.
  - Must not import markdown corpus artifacts.
- `docs/`: Governance/project documentation only.
  - Historical ADR/ATC/evidence indexes and non-runtime documentation content.
