# 0010: Afenda icon placement

## AFENDA-BRAND-001 — Placement semantics over asset choice

Frontend callers must request Afenda logo placement semantics, not raw icon asset variants.

Use `AppLogo` for product chrome and brand identity surfaces. The component owns the mapping from placement to asset, size,
frame treatment, and theme behavior.

Supported placements:

- `nav`
- `sidebar`
- `footer`
- `auth`
- `tenant-login`
- `favicon`
- `error`

## Position matrix (authoritative)

| Position / surface       | Use this API / kind                                                            | Rendered size target                | How to apply                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Landing top nav / header | `AppLogo placement="nav"` + combined lockup (`transparent` + `inline-dark`)    | 64px height (current landing shell) | Keep `allowTenantLogo={false}` and no `tagline`; set `size="xl"` and let `landing.css` enforce final rendered dimensions. |
| Landing bottom footer    | `AppLogo placement="footer"` + combined lockup (`transparent` + `inline-dark`) | 64px height (current landing shell) | Keep `allowTenantLogo={false}` and no `tagline`; set `size="xl"` and let `landing.css` enforce final rendered dimensions. |
| App sidebar expanded     | `AppLogo placement="sidebar"` + inline/inlineDark mark                         | 32px mark height                    | Keep unframed mark; tenant logo may override in tenant scope.                                                             |
| App sidebar collapsed    | `AppLogo placement="sidebar" showText={false}` + inline/inlineDark mark        | 32x32 max                           | Enforce contained square fit for tenant fallback mark.                                                                    |
| Auth entry               | `AppLogo placement="auth"` + app tile light/dark                               | 64px tile                           | Framed tile allowed for splash-style contexts.                                                                            |
| Tenant login             | `AppLogo placement="tenant-login"` + tenant logo or app tile fallback          | 64px tile                           | Prefer tenant logo; fallback uses framed tile.                                                                            |
| Favicon / launcher       | metadata icon files (PNG/Web App Manifest)                                     | browser/device-controlled           | Use app-tile/launcher outputs from `/public/icons/`.                                                                      |
| Error / not found        | `AppLogo placement="error"` + mono mark                                        | 64px                                | Brand anchor only; never replace status/functional UI icons.                                                              |

## Icon kind matrix

| Icon kind       | Primary files                                                                                       | Size family  | Where to apply                                                            |
| --------------- | --------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| Combined lockup | `afenda-combined-lockup-transparent.svg`, `afenda-combined-lockup-inline-dark.svg`                  | wide lockup  | Top-level header/nav and footer anchors that need stable brand identity.  |
| Inline mark     | `afenda-icon-transparent.svg`, `afenda-icon-inline-dark.svg`                                        | compact mark | Sidebar, docs shell, compact product chrome.                              |
| App tile        | `afenda-icon-light-bg.svg`, `afenda-icon-dark-bg.svg`, `afenda-icon-gradient-bg.svg`                | framed tile  | Auth, tenant login fallback, launcher, social preview, app icon surfaces. |
| Mono            | `afenda-icon-mono.svg`, `afenda-icon-mono-white-on-dark.svg`, `afenda-icon-mono-black-on-light.svg` | mono/print   | Error anchors, single-ink print, engraving, embossing, stamp output.      |

## Asset set doctrine

Afenda has three public brand asset sets:

- `lynx`: the canonical lynx observer mark variants in `afenda-icon-*.svg`.
- `typography`: the Afenda wordmark and typography lockups in `afenda-typography-*.svg`.
- `combined`: wide lockups in `afenda-combined-*.svg` that pair typography with approved public lynx variants.

The lynx set remains the only source for lynx and bead artwork. Typography proposal artwork must not be used as an icon
source because the beads are hidden there. Combined assets must embed or reference the ready lynx variants from
`public/brand/afenda/`, not crop the lynx from typography artwork.

Use typography-only assets where the lynx is already present, intentionally omitted, or too visually heavy for the
surface. Use combined assets for controlled brand boards, presentations, docs, social previews, and marketing identity
surfaces that can support a wide lockup. Do not use typography or combined assets for compact product chrome unless a
component explicitly supports that placement.

## Frame doctrine

Combined lockups are the default for top-level brand anchors that require stable identity:

- landing navbar
- landing footer

Use `afenda-combined-lockup-transparent.svg` on light neutral surfaces and
`afenda-combined-lockup-inline-dark.svg` on dark neutral surfaces.

Unframed inline marks belong to compact product chrome and utility identity:

- app sidebar expanded
- collapsed sidebar
- mobile drawer title
- docs shell title

Use `inline` on light neutral surfaces and `inlineDark` on dark neutral surfaces so the lynx observer and truth beads
remain white without introducing an app tile frame.

Framed app tiles belong only to surfaces where the mark must carry its own field:

- auth and tenant-login splash fallback
- favicon, Apple icon, launcher, social preview
- controlled launch or brand-preview surfaces

Mono marks belong to fallback and production contexts:

- 404 or global error brand anchor
- one-color print
- stamp, embossing, engraving, and single-ink output

## Functional icon rule

Use Afenda brand marks only for brand identity placements. Do not replace functional, navigational, status, CTA, search,
settings, error, or feature icons with the Afenda mark.

Typography and combined lockups are also brand marks. They must not replace feature icons, button icons, search icons,
status indicators, or app navigation glyphs.

## Tenant logo rule

Tenant branding wins inside tenant-scoped chrome when a tenant logo is configured.

Collapsed tenant logos must be contained within max `32x32` and must not be forced into a square crop. Expanded tenant
logos may use a wider contained wordmark, but must not distort aspect ratio.

## Theme rule

Theme-dependent logo assets must not depend on server-unknown theme state during initial render. Prefer deterministic CSS
visibility, such as rendering the light and dark assets together and toggling with `afenda-theme-light` /
`afenda-theme-dark`.

## Related authority

- Brand guideline docs: `content/i18n/docs/en/curated/brand-guidelines/index.mdx`.
- Brand component API: `src/shared/components/brand/Logo.tsx`.
- Public assets: `public/brand/afenda/`.
