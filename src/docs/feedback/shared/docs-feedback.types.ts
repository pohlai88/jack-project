/* ========================================================================
   Docs Feedback Contract — Typed Surface
   ======================================================================== */

/* ------------------------------------------------------------------------
   Opinions
   ------------------------------------------------------------------------ */

export const docsFeedbackOpinions = ['good', 'bad'] as const;
export type DocsFeedbackOpinion = (typeof docsFeedbackOpinions)[number];

export function isDocsFeedbackOpinion(value: unknown): value is DocsFeedbackOpinion {
  return typeof value === 'string' && docsFeedbackOpinions.includes(value as DocsFeedbackOpinion);
}

/* ------------------------------------------------------------------------
      Input
      ------------------------------------------------------------------------ */

export interface SubmitDocsPageFeedbackInput {
  pageUrl: string;
  pageTitle: string;
  opinion: DocsFeedbackOpinion;
  message?: string;
}

/* ------------------------------------------------------------------------
      Error Codes (authoritative registry)
      ------------------------------------------------------------------------ */

export const docsFeedbackErrorCodes = [
  'AFD-DOCS-FEEDBACK-VALIDATION',
  'AFD-DOCS-FEEDBACK-ORIGIN',
  'AFD-DOCS-FEEDBACK-RATE-LIMIT',
  'AFD-DOCS-FEEDBACK-CONTEXT',
  'AFD-DOCS-FEEDBACK-STORAGE',
] as const;

export type DocsFeedbackErrorCode = (typeof docsFeedbackErrorCodes)[number];

/* Exhaustiveness helper (for switches) */
export function assertNeverDocsFeedbackErrorCode(x: never): never {
  throw new Error(`Unhandled DocsFeedbackErrorCode: ${String(x)}`);
}

/* ------------------------------------------------------------------------
      Action Result (discriminated union)
      ------------------------------------------------------------------------ */

export interface DocsPageFeedbackSuccess {
  ok: true;
  message: string;
}

export interface DocsPageFeedbackFailure {
  ok: false;
  code: DocsFeedbackErrorCode;
  message: string;
}

export type DocsPageFeedbackActionResult = DocsPageFeedbackSuccess | DocsPageFeedbackFailure;

/* ------------------------------------------------------------------------
      Factory Helpers (prevent drift)
      ------------------------------------------------------------------------ */

export function okDocsFeedback(message: string): DocsPageFeedbackSuccess {
  return { ok: true, message };
}

export function failDocsFeedback(code: DocsFeedbackErrorCode, message: string): DocsPageFeedbackFailure {
  return { ok: false, code, message };
}

/* ------------------------------------------------------------------------
      Type Guards
      ------------------------------------------------------------------------ */

export function isDocsFeedbackSuccess(result: DocsPageFeedbackActionResult): result is DocsPageFeedbackSuccess {
  return result.ok === true;
}

export function isDocsFeedbackFailure(result: DocsPageFeedbackActionResult): result is DocsPageFeedbackFailure {
  return result.ok === false;
}
