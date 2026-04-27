import { z } from 'zod';

import { docsFeedbackOpinions, type SubmitDocsPageFeedbackInput } from './docs-feedback.types';

export const DOCS_FEEDBACK_PAGE_URL_MAX_LENGTH = 500;
export const DOCS_FEEDBACK_PAGE_TITLE_MAX_LENGTH = 160;
export const DOCS_FEEDBACK_MESSAGE_MAX_LENGTH = 2000;

export function isDocsPagePath(value: string): boolean {
  return (value === '/docs' || value.startsWith('/docs/')) && !value.startsWith('//');
}

const optionalFeedbackMessageSchema = z.preprocess((value) => {
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().max(DOCS_FEEDBACK_MESSAGE_MAX_LENGTH).optional());

export const submitDocsPageFeedbackSchema = z.object({
  pageUrl: z
    .string()
    .trim()
    .min('/docs'.length)
    .max(DOCS_FEEDBACK_PAGE_URL_MAX_LENGTH)
    .refine(isDocsPagePath, 'Feedback is only accepted for documentation pages.'),
  pageTitle: z.string().trim().min(1).max(DOCS_FEEDBACK_PAGE_TITLE_MAX_LENGTH),
  opinion: z.enum(docsFeedbackOpinions),
  message: optionalFeedbackMessageSchema,
});

export function parseSubmitDocsPageFeedbackInput(input: unknown): SubmitDocsPageFeedbackInput {
  return submitDocsPageFeedbackSchema.parse(input);
}
