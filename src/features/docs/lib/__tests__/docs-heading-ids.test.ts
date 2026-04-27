import { createDocHeadingIdGenerator, getDocHeadingBaseId } from '../docs-heading-ids';

describe('docs heading ids', () => {
  it('keeps localized heading text in generated ids', () => {
    expect(getDocHeadingBaseId('Cài đặt hồ sơ')).toBe('cài-đặt-hồ-sơ');
    expect(getDocHeadingBaseId('个人资料设置')).toBe('个人资料设置');
  });

  it('falls back when the heading has no letters or numbers', () => {
    expect(getDocHeadingBaseId('***')).toBe('section');
  });

  it('adds stable suffixes for duplicate headings', () => {
    const getId = createDocHeadingIdGenerator();

    expect(getId('Overview')).toBe('overview');
    expect(getId('Overview')).toBe('overview-2');
    expect(getId('Overview')).toBe('overview-3');
  });
});
