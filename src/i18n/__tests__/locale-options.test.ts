import { localeNames, locales } from '../config';
import { activatedLocaleOptions, activatedLocaleValues } from '../locale-options';

describe('locale-options', () => {
  it('exposes only the activated runtime locales', () => {
    expect(activatedLocaleValues).toEqual(locales);
    expect(activatedLocaleValues).toEqual(['en', 'zh-CN', 'vi', 'ms', 'es', 'id', 'th']);
  });

  it('derives labels from localeNames', () => {
    expect(activatedLocaleOptions).toEqual([
      { value: 'en', label: localeNames.en },
      { value: 'zh-CN', label: localeNames['zh-CN'] },
      { value: 'vi', label: localeNames.vi },
      { value: 'ms', label: localeNames.ms },
      { value: 'es', label: localeNames.es },
      { value: 'id', label: localeNames.id },
      { value: 'th', label: localeNames.th },
    ]);
  });

  it('does not expose unsupported locales', () => {
    const values = activatedLocaleOptions.map((option) => option.value);

    expect(values).toContain('es');
    expect(values).toContain('id');
    expect(values).toContain('th');
    expect(values).not.toContain('pt');
  });
});
