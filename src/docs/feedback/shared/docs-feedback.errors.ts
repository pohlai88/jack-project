import type { DocsFeedbackErrorCode } from './docs-feedback.types';

export const docsFeedbackErrorMessages: Record<DocsFeedbackErrorCode, string> = {
  'AFD-DOCS-FEEDBACK-VALIDATION': 'Feedback could not be submitted. Check the page and feedback details.',
  'AFD-DOCS-FEEDBACK-ORIGIN': 'Feedback could not be submitted from this origin.',
  'AFD-DOCS-FEEDBACK-RATE-LIMIT': 'Too many feedback submissions. Please wait and try again.',
  'AFD-DOCS-FEEDBACK-CONTEXT': 'Feedback could not be submitted from this request.',
  'AFD-DOCS-FEEDBACK-STORAGE': 'Feedback could not be saved right now.',
};

export class DocsFeedbackPublicError extends Error {
  readonly code: DocsFeedbackErrorCode;
  readonly safeMessage: string;

  constructor(code: DocsFeedbackErrorCode, message = docsFeedbackErrorMessages[code]) {
    super(message);
    this.name = 'DocsFeedbackPublicError';
    this.code = code;
    this.safeMessage = message;
  }
}

export function getDocsFeedbackErrorMessage(code: DocsFeedbackErrorCode): string {
  return docsFeedbackErrorMessages[code];
}
