'use client';

import { useState } from 'react';

import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

type LiveDemoResponse = {
  ok: boolean;
  message: string;
};

export function MarketingLiveDemoDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<LiveDemoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setEmail('');
    setAgreed(false);
    setSubmitting(false);
    setResponse(null);
    setError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetState();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await fetch('/api/marketing/live-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          agreedToTerms: agreed,
        }),
      });

      const payload = (await result.json()) as Partial<LiveDemoResponse> & { error?: string };
      const responseMessage = typeof payload.message === 'string' ? payload.message : undefined;
      const errorMessage = typeof payload.error === 'string' ? payload.error : undefined;

      if (!result.ok) {
        setError(responseMessage ?? errorMessage ?? 'Unable to register for the live demo right now.');
        return;
      }

      setResponse({
        ok: true,
        message: responseMessage ?? 'You are registered for the live demo queue.',
      });
    } catch {
      setError('Unable to register for the live demo right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className="marketing-nav__demo" aria-label="Open live demo registration">
          Live demo
        </button>
      </DialogTrigger>

      <DialogContent className="marketing-live-demo__dialog">
        <DialogHeader className="marketing-live-demo__header">
          <DialogTitle className="marketing-live-demo__title">Register for live demo</DialogTitle>
          <DialogDescription className="marketing-live-demo__description">
            Reserve a seat for the next guided Afenda operating review. We will confirm the live memo window by email.
          </DialogDescription>
        </DialogHeader>

        {response ? (
          <div className="marketing-live-demo__response" role="status" aria-live="polite">
            <p className="marketing-live-demo__response-title">Registration received</p>
            <p className="marketing-live-demo__response-copy">{response.message}</p>
            <p className="marketing-live-demo__response-meta">{email}</p>
            <Button type="button" className="marketing-live-demo__submit" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form className="marketing-live-demo__form" onSubmit={handleSubmit}>
            <div className="marketing-live-demo__field">
              <Label htmlFor="marketing-live-demo-email" className="marketing-live-demo__label">
                Work email
              </Label>
              <Input
                id="marketing-live-demo-email"
                type="email"
                autoComplete="email"
                className="marketing-live-demo__input"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="marketing-live-demo__consent">
              <Checkbox
                id="marketing-live-demo-consent"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="marketing-live-demo__checkbox"
              />
              <Label htmlFor="marketing-live-demo-consent" className="marketing-live-demo__consent-label">
                I agree to the live memo T&amp;C and consent to follow-up at this email.
              </Label>
            </div>

            {error ? (
              <p className="marketing-live-demo__error" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="marketing-live-demo__submit" disabled={submitting || !agreed}>
              {submitting ? 'Submitting...' : 'Register'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
