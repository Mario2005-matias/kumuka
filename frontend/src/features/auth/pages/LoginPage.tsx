import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import { useLogin } from '../hooks';
import { loginSchema, type LoginFormValues } from '../schemas';
import { ROUTES } from '@/lib/constants/routes';

export default function LoginPage() {
  const login = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Entrar</h1>
        <p className="text-sm text-muted-foreground">
          Bem-vindo de volta à KUMUKA.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="space-y-4">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="o.teu@email.com"
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
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="A tua password"
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
              Esqueci-me da password
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={login.isPending}
          >
            {login.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {login.isPending ? 'A entrar...' : 'Entrar'}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tens conta?{' '}
        <Link
          to={ROUTES.onboarding.root}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Começar agora
        </Link>
      </p>

      <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-center">
        <p className="text-xs text-muted-foreground">
          <strong>Credenciais de teste:</strong> teste@kumuka.ao / 123456
        </p>
      </div>
    </div>
  );
}