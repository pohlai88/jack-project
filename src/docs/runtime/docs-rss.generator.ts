import { Feed } from 'feed';

import { DOCS_FEED_AUTHOR, DOCS_FEED_DESCRIPTION, DOCS_FEED_PATH, DOCS_FEED_TITLE } from './docs-rss.contract';
import { DOCS_DEFAULT_LOCALE, DOCS_LOCAL_DEV_ORIGIN, DOCS_ROUTE_BASE_PATH } from './docs-runtime.contract';
import { source } from './docs-source.registry';
import { normalizeOrigin, resolveDateOrFallback } from './docs-url.shared';

type DocsPage = ReturnType<typeof source.getPages>[number];

export function getDocsRSS(): string {
  const baseUrl = getDocsFeedBaseUrl();
  const docsUrl = `${baseUrl}/${DOCS_DEFAULT_LOCALE}${DOCS_ROUTE_BASE_PATH}`;
  const feedUrl = `${baseUrl}${DOCS_FEED_PATH}`;

  const feed = new Feed({
    title: DOCS_FEED_TITLE,
    id: docsUrl,
    link: docsUrl,
    feedLinks: {
      rss: feedUrl,
    },
    language: DOCS_DEFAULT_LOCALE,
    favicon: `${baseUrl}/favicon.ico`,
    description: DOCS_FEED_DESCRIPTION,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${DOCS_FEED_AUTHOR}`,
  });

  for (const page of source.getPages(DOCS_DEFAULT_LOCALE)) {
    feed.addItem(createDocsFeedItem(baseUrl, page));
  }

  return feed.rss2();
}

function createDocsFeedItem(baseUrl: string, page: DocsPage) {
  const pageUrl = `${baseUrl}${page.url}`;

  return {
    id: pageUrl,
    title: page.data.title || pageUrl,
    description: page.data.description || '',
    link: pageUrl,
    date: getPageDate(page),
    author: [
      {
        name: DOCS_FEED_AUTHOR,
      },
    ],
  };
}

function getDocsFeedBaseUrl(): string {
  return normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL) ?? DOCS_LOCAL_DEV_ORIGIN;
}

function getPageDate(page: DocsPage): Date {
  if (page.type !== 'docs') {
    return resolveDateOrFallback(null);
  }

  return resolveDateOrFallback(page.data.lastModified);
}
