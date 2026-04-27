/** JSON message tree (nested objects or string leaves) */
export type MessageModule = Record<string, unknown>;

function isPlainRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

/**
 * Deep-merges locale messages over English so missing or partial translations
 * fall back to `en` (avoids raw keys for strings not yet translated).
 */
export function mergeWithFallbackMessages(baseMessages: MessageModule, overrideMessages: MessageModule): MessageModule {
  const out: Record<string, unknown> = { ...baseMessages };
  for (const key of Object.keys(overrideMessages)) {
    const b = out[key];
    const o = overrideMessages[key];
    if (isPlainRecord(b) && isPlainRecord(o)) {
      out[key] = mergeWithFallbackMessages(b, o);
    } else {
      out[key] = o;
    }
  }
  return out;
}
