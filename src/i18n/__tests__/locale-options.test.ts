import { localeNames, locales } from '../config';
import { activatedLocaleOptions, activatedLocaleValues } from '../locale-options';

describe('locale-options', () => {
  it('exposes only the activated runtime locales', () => {
    expect(activatedLocaleValues).toEqual(locales);
    expect(activatedLocaleValues).toEqual(['en', 'es', 'vi', 'ms', 'zh-CN']);
  });

  it('derives labels from localeNames', () => {
    expect(activatedLocaleOptions).toEqual([
      { value: 'en', label: localeNames.en },
      { value: 'es', label: localeNames.es },
      { value: 'vi', label: localeNames.vi },
      { value: 'ms', label: localeNames.ms },
      { value: 'zh-CN', label: localeNames['zh-CN'] },
    ]);
  });

  it('does not expose unsupported or planned locales', () => {
    const values = activatedLocaleOptions.map((option) => option.value);

    expect(values).not.toContain('pt');
    expect(values).not.toContain('id');
    expect(values).not.toContain('th');
  });
});
