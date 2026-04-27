import { parseSubmitDocsPageFeedbackInput } from '../shared/docs-feedback.schema';

describe('docs feedback schema', () => {
  it('trims optional messages', () => {
    const result = parseSubmitDocsPageFeedbackInput({
      pageUrl: '/docs/generated/features/docs',
      pageTitle: 'Documentation',
      opinion: 'good',
      message: '  helpful page  ',
    });

    expect(result).toMatchObject({
      pageUrl: '/docs/generated/features/docs',
      pageTitle: 'Documentation',
      opinion: 'good',
      message: 'helpful page',
    });
  });

  it('normalizes blank optional messages to undefined', () => {
    const result = parseSubmitDocsPageFeedbackInput({
      pageUrl: '/docs',
      pageTitle: 'Documentation',
      opinion: 'bad',
      message: '   ',
    });

    expect(result.message).toBeUndefined();
  });

  it('rejects non-docs page URLs', () => {
    expect(() =>
      parseSubmitDocsPageFeedbackInput({
        pageUrl: '/dashboard',
        pageTitle: 'Dashboard',
        opinion: 'good',
      }),
    ).toThrow();
  });

  it('rejects invalid opinions', () => {
    expect(() =>
      parseSubmitDocsPageFeedbackInput({
        pageUrl: '/docs',
        pageTitle: 'Documentation',
        opinion: 'maybe',
      }),
    ).toThrow();
  });
});
