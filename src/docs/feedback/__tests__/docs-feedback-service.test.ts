const dbMocks = vi.hoisted(() => {
  const insertValues = vi.fn();
  const where = vi.fn();
  const from = vi.fn(() => ({ where }));
  const select = vi.fn(() => ({ from }));
  const insert = vi.fn(() => ({ values: insertValues }));

  return {
    db: { insert, select },
    from,
    insert,
    insertValues,
    select,
    where,
  };
});

vi.mock('server-only', () => ({}));

vi.mock('@/shared/db', () => ({
  db: dbMocks.db,
}));

import * as schema from '@/shared/db/schema';

import { countRecentDocsPageFeedbackEvents, recordDocsPageFeedbackEvent } from '../server/docs-feedback-service.server';

describe('docs feedback service', () => {
  beforeEach(() => {
    dbMocks.insert.mockClear();
    dbMocks.insertValues.mockReset();
    dbMocks.select.mockClear();
    dbMocks.from.mockClear();
    dbMocks.where.mockReset();
  });

  it('records append-only feedback event payloads', async () => {
    dbMocks.insertValues.mockResolvedValue(undefined);

    await recordDocsPageFeedbackEvent({
      pageUrl: '/docs',
      pageTitle: 'Documentation',
      opinion: 'good',
      userId: null,
      message: undefined,
      rateLimitKeyHash: 'a'.repeat(64),
      userAgent: 'Mozilla/5.0 Chrome/120.0',
    });

    expect(dbMocks.insert).toHaveBeenCalledWith(schema.docsPageFeedbackEvents);
    expect(dbMocks.insertValues).toHaveBeenCalledWith({
      pageUrl: '/docs',
      pageTitle: 'Documentation',
      opinion: 'good',
      message: null,
      userId: null,
      rateLimitKeyHash: 'a'.repeat(64),
      userAgent: 'Mozilla/5.0 Chrome/120.0',
    });
  });

  it('counts recent events for DB-backed rate limiting', async () => {
    dbMocks.where.mockResolvedValue([{ total: 3 }]);

    const total = await countRecentDocsPageFeedbackEvents('hash', new Date('2026-04-27T12:00:00.000Z'));

    expect(total).toBe(3);
    expect(dbMocks.select).toHaveBeenCalledOnce();
    expect(dbMocks.from).toHaveBeenCalledWith(schema.docsPageFeedbackEvents);
    expect(dbMocks.where).toHaveBeenCalledOnce();
  });
});
