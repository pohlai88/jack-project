/**
 * Pure helpers: Tolgee Platform JSON export → Afenda nested catalog shape (aligned to `en` source).
 */

const BCP47_LIKE = /^[a-z]{2}(-[A-Z][a-z]{3}|-[A-Z]{2})?$/;

/**
 * If Tolgee wraps messages under a single locale key, unwrap to the inner object.
 * @param {unknown} obj
 * @param {string | null} [forcedLocale]
 * @returns {{ messages: unknown; detectedLocale: string | null }}
 */
export function unwrapTolgeeLocaleWrapper(obj, forcedLocale = null) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return { messages: obj, detectedLocale: null };
  }
  const keys = Object.keys(obj);
  if (keys.length !== 1) {
    return { messages: obj, detectedLocale: null };
  }
  const only = keys[0];
  const inner = obj[only];
  if (typeof inner !== 'object' || inner === null || Array.isArray(inner)) {
    return { messages: obj, detectedLocale: null };
  }
  if (forcedLocale && only === forcedLocale) {
    return { messages: inner, detectedLocale: only };
  }
  if (!forcedLocale && BCP47_LIKE.test(only)) {
    return { messages: inner, detectedLocale: only };
  }
  return { messages: obj, detectedLocale: null };
}

/**
 * Expand `{ "a.b.c": "x" }` → nested `{ a: { b: { c: "x" } } }`. No-op if no dotted keys at current level.
 * @param {unknown} value
 */
export function expandDotKeys(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }
  const entries = Object.entries(value);
  const hasDot = entries.some(([k]) => k.includes('.'));
  if (!hasDot) {
    const out = {};
    for (const [k, v] of entries) {
      out[k] = typeof v === 'object' && v !== null && !Array.isArray(v) ? expandDotKeys(v) : v;
    }
    return out;
  }
  const root = {};
  for (const [key, val] of entries) {
    if (!key.includes('.')) {
      root[key] = typeof val === 'object' && val !== null && !Array.isArray(val) ? expandDotKeys(val) : val;
      continue;
    }
    const parts = key.split('.');
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!node[p] || typeof node[p] !== 'object' || Array.isArray(node[p])) {
        node[p] = {};
      }
      node = node[p];
    }
    node[parts[parts.length - 1]] = val;
  }
  return expandDotKeys(root);
}

/**
 * @param {string} tolgeeStem filename without .json
 * @param {Record<string, string>} tolgeeTagToCatalogLocale
 * @param {readonly string[]} activeLocales
 * @returns {{ catalogLocale: string } | { skip: string }}
 */
export function resolveCatalogLocale(tolgeeStem, tolgeeTagToCatalogLocale, activeLocales) {
  const mapped = tolgeeTagToCatalogLocale[tolgeeStem];
  if (mapped) {
    if (!activeLocales.includes(mapped)) {
      return { skip: `mapped locale "${mapped}" is not active in locale-registry` };
    }
    return { catalogLocale: mapped };
  }
  if (activeLocales.includes(tolgeeStem)) {
    return { catalogLocale: tolgeeStem };
  }
  return { skip: `no tolgee-locale-map entry for "${tolgeeStem}" and stem is not an active locale` };
}
