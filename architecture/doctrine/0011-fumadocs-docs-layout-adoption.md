# 0011 - Fumadocs Docs Layout Adoption

## Rule

Afenda documentation uses `fumadocs-ui/layouts/docs` as the canonical docs app layout.

Do not replace it with `notebook`, `flux`, `home`, or a custom navbar/sidebar shell without an ADR that changes the
documentation product requirements.

## Rationale

Afenda docs are not a marketing surface or a compact notebook. They are an operational documentation system with:

- localized page trees;
- generated evidence pages;
- OpenAPI pages;
- sidebar navigation;
- page TOC;
- search;
- LLM export links;
- brand-governed nav identity.

The default Fumadocs Docs Layout is the only reviewed option that directly matches this shape. It owns the sidebar,
mobile header, page tree rendering, layout tabs, TOC, and link/nav configuration while keeping server-rendered layout
props compatible with this app.

## Rejected Options

- `fumadocs-ui/layouts/home`: navbar-only; insufficient for documentation navigation.
- `fumadocs-ui/layouts/notebook`: compact and more opinionated; useful for smaller docs, but it restricts shell
  replacement and is not the primary operational docs layout.
- `fumadocs-ui/layouts/flux`: intentionally minimal and experimental; client-component constraints conflict with
  server-rendered docs layout props and generated evidence navigation.

## Required Implementation

- Docs route layout imports `DocsLayout` from `fumadocs-ui/layouts/docs`.
- Docs pages import page primitives from `fumadocs-ui/layouts/docs/page`.
- Layout links use `BaseLayoutProps['links']`.
- Navbar identity uses supported `nav.title` and `nav.url` options from shared base layout config.
- Do not use `nav.component` unless an ADR also defines the replacement height and CSS variable contract.
