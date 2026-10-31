import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { ROUTES } from '@/lib/constants/routes';
import { useResetPassword } from '../hooks';
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from '../schemas';

export default function ResetPasswordPage() {
  const { t } = useTranslation('auth');
  const { token = '' } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const reset = useResetPassword();
  const schema = useMemo(() => createResetPasswordSchema(t), [t]);
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  if (!token || !email) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">{t('reset.invalidLinkTitle')}</h1>
        <p className="text-sm text-muted-foreground">{t('reset.invalidLink')}</p>
        <Button className="h-11 w-full" nativeButton={false} render={<Link to={ROUTES.auth.forgot} />}>
          {t('reset.requestNewLink')}
        </Button>
      </div>
    );
  }

  const fields = [
    { name: 'password', label: t('reset.password') },
    { name: 'confirmPassword', label: t('reset.confirmPassword') },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('reset.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('reset.description', { email })}</p>
      </div>

      <form
        noValidate
        onSubmit={form.handleSubmit((values) => reset.mutate({ ...values, token, email }))}
      >
        <FieldGroup className="space-y-4">
          {fields.map(({ name, label }) => (
            <Controller
              control={form.control}
              key={name}
              name={name}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="new-password"
                    className="py-5"
                    disabled={reset.isPending}
                    id={field.name}
                    type="password"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          ))}
          <Button className="h-11 w-full" disabled={reset.isPending} type="submit">
            {reset.isPending && <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />}
            {reset.isPending ? t('reset.submitting') : t('reset.submit')}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
