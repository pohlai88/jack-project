'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from '@/i18n/navigation';

import { Button, FormFieldError, FormGlobalError, FormLabel, Input } from '@/shared/components/ui';
import { createOrganizationAction } from '../actions/create-organization-action';
import { normalizeOrganizationSlug } from '../lib/organization-slug';

const formSchema = z.object({
  organizationName: z.string().trim().min(2, 'Name is required').max(255),
  organizationSlug: z.string().trim().min(1, 'URL slug is required').max(100),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateOrganizationForm() {
  const router = useRouter();
  const { update } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { organizationName: '', organizationSlug: '' },
  });

  const slugFromName = useCallback((name: string) => normalizeOrganizationSlug(name.replace(/\s+/g, '-')), []);

  const onNameBlur = () => {
    const name = form.getValues('organizationName');
    const currentSlug = form.getValues('organizationSlug');
    if (name && !currentSlug) {
      form.setValue('organizationSlug', slugFromName(name), { shouldValidate: true });
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const result = await createOrganizationAction({
        organizationName: values.organizationName,
        organizationSlug: values.organizationSlug,
      });
      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      await update();
      router.push(`/t/${result.slug}/onboarding/cv`);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left">
      {serverError ? <FormGlobalError visible>{serverError}</FormGlobalError> : null}

      <div className="space-y-2">
        <FormLabel htmlFor="organizationName">Organization name</FormLabel>
        <Input
          id="organizationName"
          autoComplete="organization"
          disabled={isSubmitting}
          {...form.register('organizationName', { onBlur: onNameBlur })}
        />
        <FormFieldError visible={!!form.formState.errors.organizationName}>
          {form.formState.errors.organizationName?.message}
        </FormFieldError>
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="organizationSlug">URL slug</FormLabel>
        <Input
          id="organizationSlug"
          autoComplete="off"
          spellCheck={false}
          placeholder="your-company"
          disabled={isSubmitting}
          {...form.register('organizationSlug')}
        />
        <p className="text-xs text-muted-foreground">Letters, numbers, and hyphens. Used in paths and subdomains.</p>
        <FormFieldError visible={!!form.formState.errors.organizationSlug}>
          {form.formState.errors.organizationSlug?.message}
        </FormFieldError>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create organization'}
      </Button>
    </form>
  );
}
