import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { useLogin } from "../hooks";
import { createLoginSchema, type LoginFormValues } from "../schemas";
import { ROUTES } from "@/lib/constants/routes";

export default function LoginPage() {
  const { t, i18n } = useTranslation('auth');
  const login = useLogin();
  const schema = useMemo(() => createLoginSchema(t), [t]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });
  const currentLanguage = useRef(i18n.resolvedLanguage);

  useEffect(() => {
    if (currentLanguage.current === i18n.resolvedLanguage) return;
    currentLanguage.current = i18n.resolvedLanguage;
    const invalidFields = (['email', 'password'] as const).filter(
      (field) => form.formState.errors[field],
    );
    if (invalidFields.length) void form.trigger(invalidFields);
  }, [form, i18n.resolvedLanguage]);

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('login.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('login.welcome')}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="space-y-4 ">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field className="h-12" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t('login.email')}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  className="py-5"
                  placeholder={t('login.emailPlaceholder')}
                  autoComplete="email"
                  disabled={login.isPending}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field className="h-12" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>{t('login.password')}</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  className="py-5"
                  placeholder={t('login.passwordPlaceholder')}
                  autoComplete="current-password"
                  disabled={login.isPending}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex justify-end">
            <Link
              to={ROUTES.auth.forgot}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              {t('login.forgot')}
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full h-10"
            size="lg"
            disabled={login.isPending}
          >
            {login.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {login.isPending ? t('login.submitting') : t('login.submit')}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t('login.noAccount')}{' '}
        <Link
          to={ROUTES.onboarding.root}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t('login.register')}
        </Link>
      </p>

      <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">
          <strong>{t('login.testCredentials')}</strong> maria.silva@kumuka.ao / 123456
        </p>
      </div>
    </div>
  );
}
