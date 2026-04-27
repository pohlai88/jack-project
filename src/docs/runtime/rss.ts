import { Feed } from 'feed';

import { docsFeedPath, docsFeedTitle } from './rss-metadata';
import { source } from './source';

const defaultBaseUrl = 'http://localhost:3000';
const defaultFeedDate = new Date('1970-01-01T00:00:00.000Z');

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? defaultBaseUrl).replace(/\/$/, '');
}

function getPageDate(page: ReturnType<typeof source.getPages>[number]) {
  const lastModified = page.data.lastModified;
  if (lastModified instanceof Date && !Number.isNaN(lastModified.getTime())) {
    return lastModified;
  }

  if (typeof lastModified === 'string') {
    const parsed = new Date(lastModified);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return defaultFeedDate;
}

export function getDocsRSS() {
  const baseUrl = getBaseUrl();
  const feedUrl = `${baseUrl}${docsFeedPath}`;
  const docsUrl = `${baseUrl}/en/docs`;

  const feed = new Feed({
    title: docsFeedTitle,
    id: docsUrl,
    link: docsUrl,
    feedLinks: {
      rss: feedUrl,
    },
    language: 'en',
    favicon: `${baseUrl}/favicon.ico`,
    description: 'Afenda documentation evidence generated from governed product truth.',
    copyright: `All rights reserved ${new Date().getFullYear()}, Afenda`,
  });

  for (const page of source.getPages('en')) {
    const pageUrl = `${baseUrl}${page.url}`;

    feed.addItem({
      id: pageUrl,
      title: page.data.title,
      description: page.data.description,
      link: pageUrl,
      date: getPageDate(page),
      author: [
        {
          name: 'Afenda',
        },
      ],
    });
  }

  return feed.rss2();
}
