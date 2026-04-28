'use client';

import { CheckCircle2, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import { type FormEvent, useId, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

import { submitDocsPageFeedbackAction } from '../server/submit-docs-page-feedback';
import type { DocsFeedbackOpinion } from '../shared/docs-feedback.types';

const MAX_MESSAGE_LENGTH = 2000;

interface DocsPageFeedbackProps {
  pageUrl: string;
  pageTitle: string;
}

export function DocsPageFeedback({ pageUrl, pageTitle }: DocsPageFeedbackProps) {
  const titleId = useId();
  const descriptionId = useId();
  const textareaId = useId();

  const [opinion, setOpinion] = useState<DocsFeedbackOpinion | null>(null);
  const [message, setMessage] = useState('');
  const [submittedOpinion, setSubmittedOpinion] = useState<DocsFeedbackOpinion | null>(null);
  const [isPending, startTransition] = useTransition();

  const trimmedMessage = useMemo(() => message.trim(), [message]);
  const isSubmittedForCurrentOpinion = submittedOpinion === opinion;

  function selectOpinion(nextOpinion: DocsFeedbackOpinion) {
    setOpinion(nextOpinion);

    if (submittedOpinion && submittedOpinion !== nextOpinion) {
      setSubmittedOpinion(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!opinion) {
      toast.error('Choose Yes or No first.');
      return;
    }

    if (isPending || isSubmittedForCurrentOpinion) return;

    startTransition(async () => {
      const result = await submitDocsPageFeedbackAction({
        pageUrl,
        pageTitle,
        opinion,
        message: trimmedMessage,
      });

      if (result.ok) {
        setSubmittedOpinion(opinion);
        setMessage('');
        toast.success(result.message);
        return;
      }

      toast.error(result.message);
    });
  }

  return (
    <section
      className="not-wysiwyg mt-10 border-t border-border pt-6"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id={titleId} className="text-sm font-medium text-foreground">
              Was this page helpful?
            </h2>
            <p id={descriptionId} className="mt-1 text-sm text-muted-foreground">
              Send feedback to improve this documentation.
            </p>
          </div>

          <div className="flex shrink-0 gap-2" role="group" aria-label="Page helpfulness">
            <Button
              type="button"
              size="sm"
              variant={opinion === 'good' ? 'default' : 'outline'}
              aria-pressed={opinion === 'good'}
              onClick={() => selectOpinion('good')}
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" aria-hidden="true" />
              Yes
            </Button>

            <Button
              type="button"
              size="sm"
              variant={opinion === 'bad' ? 'default' : 'outline'}
              aria-pressed={opinion === 'bad'}
              onClick={() => selectOpinion('bad')}
              className="gap-2"
            >
              <ThumbsDown className="h-4 w-4" aria-hidden="true" />
              No
            </Button>
          </div>
        </div>

        {opinion ? (
          <div className="space-y-3">
            <Textarea
              id={textareaId}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                if (isSubmittedForCurrentOpinion) {
                  setSubmittedOpinion(null);
                }
              }}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={3}
              placeholder="Optional note"
              aria-label="Optional documentation feedback note"
              aria-describedby={`${textareaId}-counter`}
              disabled={isPending}
            />

            <div className="flex items-center justify-between gap-3">
              <p id={`${textareaId}-counter`} className="text-xs text-muted-foreground">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </p>

              {isSubmittedForCurrentOpinion ? (
                <p
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                  Feedback recorded
                </p>
              ) : (
                <Button type="submit" size="sm" disabled={isPending} className="gap-2">
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {isPending ? 'Sending…' : 'Send'}
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </form>
    </section>
  );
}
