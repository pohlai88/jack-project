import { mergeWithFallbackMessages } from '../merge-messages';

describe('mergeWithFallbackMessages', () => {
  it('fills missing keys from the base bundle', () => {
    const base = { a: { x: 'en-x', y: 'en-y' }, b: 'en-b' };
    const override = { a: { x: 'es-x' } };
    expect(mergeWithFallbackMessages(base, override)).toEqual({
      a: { x: 'es-x', y: 'en-y' },
      b: 'en-b',
    });
  });

  it('replaces leaf strings from the override', () => {
    expect(mergeWithFallbackMessages({ t: 'en' }, { t: 'es' })).toEqual({ t: 'es' });
  });
});
