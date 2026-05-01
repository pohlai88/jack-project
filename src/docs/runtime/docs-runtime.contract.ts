/**
 * Canonical docs runtime contract.
 *
 * Keep this file boring and stable. It owns cross-cutting constants that are
 * shared by docs source loading, RSS, OG, LLM exports, and URL generation.
 */
export const DOCS_DEFAULT_LOCALE = 'en' as const;
export const DOCS_ROUTE_BASE_PATH = '/docs' as const;
export const DOCS_OG_BASE_PATH = '/og/docs' as const;
export const DOCS_SEARCH_API_PATH = '/api/search' as const;
export const DOCS_LLM_INDEX_PATH = '/llms.txt' as const;
export const DOCS_LLM_FULL_PATH = '/llms-full.txt' as const;
export const DOCS_OPENAPI_BASE_DIR = 'openapi' as const;
export const DOCS_LOCAL_DEV_ORIGIN = 'http://localhost:3000' as const;
export const DOCS_MARKDOWN_EXTENSION = '.mdx' as const;

export const DOCS_FALLBACK_DATE = new Date('1970-01-01T00:00:00.000Z');
