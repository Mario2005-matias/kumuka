import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Loader2, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { ROUTES } from '@/lib/constants/routes';
import { useForgotPassword } from '../hooks';
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '../schemas';

export default function ForgotPasswordPage() {
  const { t } = useTranslation('auth');
  const forgot = useForgotPassword();
  const schema = useMemo(() => createForgotPasswordSchema(t), [t]);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  if (forgot.isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <MailCheck aria-hidden="true" className="mx-auto size-12 text-primary" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{t('forgot.sentTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('forgot.sentDescription')}</p>
        </div>
        <Button className="h-11 w-full" nativeButton={false} render={<Link to={ROUTES.auth.login} />}>
          {t('forgot.backToLogin')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('forgot.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('forgot.description')}</p>
      </div>

      <form noValidate onSubmit={form.handleSubmit((values) => forgot.mutate(values))}>
        <FieldGroup className="space-y-4">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t('login.email')}</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                  className="py-5"
                  disabled={forgot.isPending}
                  id={field.name}
                  placeholder={t('login.emailPlaceholder')}
                  type="email"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button className="h-11 w-full" disabled={forgot.isPending} type="submit">
            {forgot.isPending && <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />}
            {forgot.isPending ? t('forgot.submitting') : t('forgot.submit')}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm">
        <Link className="font-medium text-primary underline-offset-4 hover:underline" to={ROUTES.auth.login}>
          {t('forgot.backToLogin')}
        </Link>
      </p>
    </div>
  );
}
