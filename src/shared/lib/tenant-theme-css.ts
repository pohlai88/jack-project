import { applySettingsDefaults } from '@/shared/lib/tenant-settings';
import type { AppliedTenantSettings, TenantSettings, TenantSettingsInput } from '@/shared/lib/tenant-settings';

export type TenantThemeMode = 'light' | 'dark';
export type TenantThemeCssVariables = Record<`--${string}`, string>;

export const TENANT_THEME_CSS_PROPERTIES = [
  '--primary',
  '--primary-foreground',
  '--ring',
  '--secondary',
  '--secondary-foreground',
  '--accent',
  '--accent-foreground',
  '--brand-gradient-from',
  '--brand-gradient-to',
  '--radius',
  '--chart-1',
  '--chart-2',
  '--font-family',
  '--density-multiplier',
  '--surface-style',
  '--shadow-xs',
  '--shadow-sm',
  '--shadow-md',
  '--shadow-lg',
  '--shadow-xl',
  '--background',
  '--foreground',
  '--card',
  '--border',
  '--input',
  '--muted',
  '--muted-foreground',
] as const;

type TenantThemeSettings = TenantSettings | TenantSettingsInput | AppliedTenantSettings;

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace('#', '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;

  return {
    r: parseInt(match[1], 16) / 255,
    g: parseInt(match[2], 16) / 255,
    b: parseInt(match[3], 16) / 255,
  };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hexToHslString(hex: string): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

function lightenHsl(hex: string, lightnessBoost: number = 15): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return `${hsl.h} ${Math.max(hsl.s - 5, 0)}% ${Math.min(hsl.l + lightnessBoost, 85)}%`;
}

function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;

  const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
  return luminance > 0.5;
}

const FONT_FAMILY_MAP: Record<string, string> = {
  'dm-sans': '"DM Sans", sans-serif',
  inter: '"Inter", sans-serif',
  'open-sans': '"Open Sans", sans-serif',
  system: 'system-ui, -apple-system, sans-serif',
};

const SURFACE_ELEVATION_MAP: Record<string, Record<string, string>> = {
  flat: {
    xs: '0 0 0 rgba(0, 0, 0, 0)',
    sm: '0 0 0 rgba(0, 0, 0, 0)',
    md: '0 0 0 rgba(0, 0, 0, 0)',
    lg: '0 0 0 rgba(0, 0, 0, 0)',
    xl: '0 0 0 rgba(0, 0, 0, 0)',
  },
  elevated: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  glass: {
    xs: '0 0 0 1px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    sm: '0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    md: '0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    lg: '0 0 0 1px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
    xl: '0 0 0 1px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  },
};

const NEUTRAL_WARMTH_PALETTES: Record<string, Record<string, string>> = {
  cool: {
    background: '210 8% 96%',
    foreground: '210 10% 16%',
    card: '210 6% 98%',
    border: '210 6% 88%',
    input: '210 6% 88%',
    muted: '210 8% 92%',
    mutedForeground: '210 5% 42%',
  },
  neutral: {
    background: '0 0% 96%',
    foreground: '0 0% 16%',
    card: '0 0% 98%',
    border: '0 0% 88%',
    input: '0 0% 88%',
    muted: '0 0% 92%',
    mutedForeground: '0 0% 42%',
  },
  warm: {
    background: '30 8% 96%',
    foreground: '30 10% 16%',
    card: '30 6% 98%',
    border: '30 6% 88%',
    input: '30 6% 88%',
    muted: '30 8% 92%',
    mutedForeground: '30 5% 42%',
  },
  soft: {
    background: '240 14% 96%',
    foreground: '240 8% 16%',
    card: '240 14% 98%',
    border: '240 10% 88%',
    input: '240 10% 88%',
    muted: '240 10% 92%',
    mutedForeground: '240 5% 42%',
  },
};

const DENSITY_MULTIPLIER_MAP: Record<string, number> = {
  compact: 0.75,
  default: 1,
  comfortable: 1.25,
};

const RADIUS_MAP: Record<string, string> = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.625rem',
  xl: '1rem',
};

export function getTenantThemeCssVariables(
  settings: TenantThemeSettings,
  mode: TenantThemeMode,
): TenantThemeCssVariables {
  const ui = applySettingsDefaults(settings).ui;
  const variables: TenantThemeCssVariables = {};
  const isDark = mode === 'dark';

  const primaryHsl = isDark ? lightenHsl(ui.primaryColor, 15) : hexToHslString(ui.primaryColor);
  if (primaryHsl) {
    variables['--primary'] = primaryHsl;
    variables['--ring'] = primaryHsl;
  }
  variables['--primary-foreground'] = isLightColor(ui.primaryColor) ? '240 10% 16%' : '0 0% 100%';

  const secondaryHsl = isDark ? lightenHsl(ui.secondaryColor, 12) : hexToHslString(ui.secondaryColor);
  if (secondaryHsl) {
    variables['--secondary'] = secondaryHsl;
  }
  variables['--secondary-foreground'] = isLightColor(ui.secondaryColor) ? '240 10% 16%' : '0 0% 100%';

  const accentHsl = isDark ? lightenHsl(ui.accentColor, 10) : hexToHslString(ui.accentColor);
  if (accentHsl) {
    variables['--accent'] = accentHsl;
  }
  variables['--accent-foreground'] = isLightColor(ui.accentColor) ? '240 10% 16%' : '0 0% 100%';

  if (ui.brandGradientEnabled) {
    const gradientFrom = isDark ? lightenHsl(ui.primaryColor, 15) : hexToHslString(ui.primaryColor);
    const gradientTo = isDark ? lightenHsl(ui.secondaryColor, 12) : hexToHslString(ui.secondaryColor);
    if (gradientFrom) variables['--brand-gradient-from'] = gradientFrom;
    if (gradientTo) variables['--brand-gradient-to'] = gradientTo;
  }

  variables['--radius'] = RADIUS_MAP[ui.borderRadius] ?? RADIUS_MAP.lg;
  variables['--font-family'] = FONT_FAMILY_MAP[ui.fontFamily] ?? FONT_FAMILY_MAP['dm-sans'];
  variables['--density-multiplier'] = String(DENSITY_MULTIPLIER_MAP[ui.density] ?? 1);
  variables['--surface-style'] = ui.surfaceStyle;

  const shadows = SURFACE_ELEVATION_MAP[ui.surfaceStyle] ?? SURFACE_ELEVATION_MAP.elevated;
  variables['--shadow-xs'] = shadows.xs;
  variables['--shadow-sm'] = shadows.sm;
  variables['--shadow-md'] = shadows.md;
  variables['--shadow-lg'] = shadows.lg;
  variables['--shadow-xl'] = shadows.xl;

  const palette = NEUTRAL_WARMTH_PALETTES[ui.neutralWarmth] ?? NEUTRAL_WARMTH_PALETTES.warm;
  if (isDark) {
    if (ui.neutralWarmth === 'soft') {
      variables['--background'] = '240 14% 10%';
      variables['--foreground'] = '240 8% 93%';
      variables['--card'] = '240 14% 10%';
      variables['--border'] = '240 10% 22%';
      variables['--input'] = '240 10% 22%';
      variables['--muted'] = '240 10% 18%';
      variables['--muted-foreground'] = '240 5% 62%';
    } else {
      const bgMatch = palette.background.match(/^(\d+)\s+(\d+)%\s+(\d+)%$/);
      const fgMatch = palette.foreground.match(/^(\d+)\s+(\d+)%\s+(\d+)%$/);

      if (bgMatch && fgMatch) {
        const bgHuesat = `${bgMatch[1]} ${bgMatch[2]}%`;
        const fgHuesat = `${fgMatch[1]} ${fgMatch[2]}%`;
        variables['--background'] = `${bgHuesat} 12%`;
        variables['--foreground'] = `${fgHuesat} 92%`;
        variables['--card'] = `${bgHuesat} 18%`;
        variables['--border'] = `${bgHuesat} 28%`;
        variables['--input'] = `${bgHuesat} 28%`;
        variables['--muted'] = `${bgHuesat} 22%`;
        variables['--muted-foreground'] = `${fgHuesat} 60%`;
      }
    }
  } else {
    variables['--background'] = palette.background;
    variables['--foreground'] = palette.foreground;
    variables['--card'] = palette.card;
    variables['--border'] = palette.border;
    variables['--input'] = palette.input;
    variables['--muted'] = palette.muted;
    variables['--muted-foreground'] = palette.mutedForeground;
  }

  if (primaryHsl) variables['--chart-1'] = primaryHsl;
  if (secondaryHsl) variables['--chart-2'] = secondaryHsl;

  return variables;
}

export function applyTenantThemeCssVariables(
  target: HTMLElement,
  settings: TenantThemeSettings,
  mode: TenantThemeMode,
) {
  clearTenantThemeCssVariables(target);

  const variables = getTenantThemeCssVariables(settings, mode);
  for (const [prop, value] of Object.entries(variables)) {
    target.style.setProperty(prop, value);
  }
}

export function clearTenantThemeCssVariables(target: HTMLElement) {
  for (const prop of TENANT_THEME_CSS_PROPERTIES) {
    target.style.removeProperty(prop);
  }
}

function serializeCssVariables(variables: TenantThemeCssVariables): string {
  return Object.entries(variables)
    .map(([prop, value]) => `${prop}:${String(value).replace(/[;{}]/g, '')}`)
    .join(';');
}

export function createTenantThemeStyleText(settings: TenantThemeSettings): string {
  const lightVariables = serializeCssVariables(getTenantThemeCssVariables(settings, 'light'));
  const darkVariables = serializeCssVariables(getTenantThemeCssVariables(settings, 'dark'));

  return `:root{${lightVariables}}.dark{${darkVariables}}`;
}
