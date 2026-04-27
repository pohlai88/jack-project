import { index, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { users } from './auth';
import { appSchema } from './schema';

export const docsFeedbackOpinionEnum = appSchema.enum('docs_feedback_opinion', ['good', 'bad']);

export const docsPageFeedbackEvents = appSchema.table(
  'docs_page_feedback_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    pageUrl: text('page_url').notNull(),
    pageTitle: varchar('page_title', { length: 160 }).notNull(),
    opinion: docsFeedbackOpinionEnum('opinion').notNull(),
    message: text('message'),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    rateLimitKeyHash: varchar('rate_limit_key_hash', { length: 64 }).notNull(),
    userAgent: varchar('user_agent', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [
    index('docs_page_feedback_events_page_url_idx').on(table.pageUrl),
    index('docs_page_feedback_events_rate_limit_idx').on(table.rateLimitKeyHash, table.createdAt),
    index('docs_page_feedback_events_user_idx').on(table.userId),
    index('docs_page_feedback_events_created_at_idx').on(table.createdAt),
  ],
);

export type DocsPageFeedbackEvent = typeof docsPageFeedbackEvents.$inferSelect;
export type NewDocsPageFeedbackEvent = typeof docsPageFeedbackEvents.$inferInsert;
export type DocsFeedbackOpinion = (typeof docsFeedbackOpinionEnum.enumValues)[number];
