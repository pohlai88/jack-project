export const docsFeedbackOpinions = ['good', 'bad'] as const;

export type DocsFeedbackOpinion = (typeof docsFeedbackOpinions)[number];

export interface SubmitDocsPageFeedbackInput {
  pageUrl: string;
  pageTitle: string;
  opinion: DocsFeedbackOpinion;
  message?: string;
}

export type DocsFeedbackErrorCode =
  | 'AFD-DOCS-FEEDBACK-VALIDATION'
  | 'AFD-DOCS-FEEDBACK-ORIGIN'
  | 'AFD-DOCS-FEEDBACK-RATE-LIMIT'
  | 'AFD-DOCS-FEEDBACK-CONTEXT'
  | 'AFD-DOCS-FEEDBACK-STORAGE';

export type DocsPageFeedbackActionResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      code: DocsFeedbackErrorCode;
      message: string;
    };
