import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { RegisterInput } from '@/features/auth/types';

interface CredentialsStepProps {
  isAuthenticated: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
  onRegister: (credentials: RegisterInput) => Promise<void>;
  onContinue: () => void;
}

function createCredentialsSchema(t: TFunction<'onboarding'>) {
  return z
    .object({
      email: z.string().email(t('credentials.invalidEmail')),
      password: z
        .string()
        .min(8, t('credentials.shortPassword', { count: 8 })),
      confirmPassword: z
        .string()
        .min(1, t('credentials.requiredConfirmation')),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t('credentials.passwordMismatch'),
      path: ['confirmPassword'],
    });
}

export function CredentialsStep({
  isAuthenticated,
  isSubmitting,
  errorMessage,
  onRegister,
  onContinue,
}: CredentialsStepProps) {
  const { t, i18n } = useTranslation('onboarding');
  const schema = useMemo(() => createCredentialsSchema(t), [t]);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });
  const currentLanguage = useRef(i18n.resolvedLanguage);

  useEffect(() => {
    if (currentLanguage.current === i18n.resolvedLanguage) return;
    currentLanguage.current = i18n.resolvedLanguage;
    const invalidFields = (
      ['email', 'password', 'confirmPassword'] as const
    ).filter((field) => form.formState.errors[field]);
    if (invalidFields.length) void form.trigger(invalidFields);
  }, [form, i18n.resolvedLanguage]);

  if (isAuthenticated) {
    return (
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{t('credentials.alreadyReady')}</h1>
          <p className="text-muted-foreground">
            {t('credentials.alreadyReadyDescription')}
          </p>
        </div>
        <Button className="w-full" onClick={onContinue} type="button">
          {t('credentials.continue')}
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t('credentials.title')}</h1>
        <p className="text-muted-foreground">
          {t('credentials.description')}
        </p>
      </div>

      <form
        className="space-y-4"
        noValidate
        onSubmit={form.handleSubmit(onRegister)}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="onboarding-email">
            {t('credentials.email')}
          </label>
          <Input
            autoComplete="email"
            id="onboarding-email"
            placeholder={t('credentials.emailPlaceholder')}
            type="email"
            {...form.register('email')}
          />
          {form.formState.errors.email?.message && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="onboarding-password">
            {t('credentials.password')}
          </label>
          <Input
            autoComplete="new-password"
            id="onboarding-password"
            type="password"
            {...form.register('password')}
          />
          {form.formState.errors.password?.message && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="onboarding-confirm-password">
            {t('credentials.confirmPassword')}
          </label>
          <Input
            autoComplete="new-password"
            id="onboarding-confirm-password"
            type="password"
            {...form.register('confirmPassword')}
          />
          {form.formState.errors.confirmPassword?.message && (
            <p className="text-sm text-destructive" role="alert">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {errorMessage && (
          <p className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        )}

        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting
            ? t('credentials.creating')
            : t('credentials.createAndContinue')}
        </Button>
      </form>
    </section>
  );
}