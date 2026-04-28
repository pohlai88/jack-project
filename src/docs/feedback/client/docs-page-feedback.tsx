'use client';

import { CheckCircle2, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import { type FormEvent, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

import { submitDocsPageFeedbackAction } from '../server/submit-docs-page-feedback';
import type { DocsFeedbackOpinion } from '../shared/docs-feedback.types';

interface DocsPageFeedbackProps {
  pageUrl: string;
  pageTitle: string;
}

export function DocsPageFeedback({ pageUrl, pageTitle }: DocsPageFeedbackProps) {
  const [opinion, setOpinion] = useState<DocsFeedbackOpinion | null>(null);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function selectOpinion(nextOpinion: DocsFeedbackOpinion) {
    setOpinion(nextOpinion);
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!opinion) {
      toast.error('Choose a feedback option first.');
      return;
    }

    startTransition(async () => {
      const result = await submitDocsPageFeedbackAction({
        pageUrl,
        pageTitle,
        opinion,
        message,
      });

      if (result.ok) {
        setSubmitted(true);
        setMessage('');
        toast.success(result.message);
        return;
      }

      toast.error(result.message);
    });
  }

  return (
    <section className="not-wysiwyg mt-10 border-t border-border pt-6" aria-labelledby="docs-page-feedback-title">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="docs-page-feedback-title" className="text-sm font-medium text-foreground">
              Was this page helpful?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Send feedback to improve this documentation.</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              size="sm"
              variant={opinion === 'good' ? 'default' : 'outline'}
              aria-pressed={opinion === 'good'}
              onClick={() => selectOpinion('good')}
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
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
              <ThumbsDown className="h-4 w-4" />
              No
            </Button>
          </div>
        </div>

        {opinion ? (
          <div className="space-y-3">
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={2000}
              rows={3}
              placeholder="Optional note"
              aria-label="Optional documentation feedback note"
              disabled={isPending || submitted}
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">{message.length}/2000</p>
              {submitted ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Feedback recorded
                </p>
              ) : (
                <Button type="submit" size="sm" disabled={isPending} className="gap-2">
                  <Send className="h-4 w-4" />
                  {isPending ? 'Sending...' : 'Send'}
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </form>
    </section>
  );
}
