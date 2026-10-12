import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { RegisterInput } from '@/features/auth/types';

const credentialsSchema = z
  .object({
    email: z.string().email('Insere um endereço de email válido.'),
    password: z.string().min(8, 'A password deve ter pelo menos 8 caracteres.'),
    confirmPassword: z.string().min(1, 'Confirma a tua password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'As passwords não coincidem.',
    path: ['confirmPassword'],
  });

interface CredentialsStepProps {
  isAuthenticated: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
  onRegister: (credentials: RegisterInput) => Promise<void>;
  onContinue: () => void;
}

export function CredentialsStep({
  isAuthenticated,
  isSubmitting,
  errorMessage,
  onRegister,
  onContinue,
}: CredentialsStepProps) {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  if (isAuthenticated) {
    return (
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">A tua conta já está pronta</h1>
          <p className="text-muted-foreground">
            Continua a personalizar a tua experiência na KUMUKA.
          </p>
        </div>
        <Button className="w-full" onClick={onContinue} type="button">
          Continuar
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Cria a tua conta</h1>
        <p className="text-muted-foreground">
          Usa um email a que tenhas acesso e escolhe uma password segura.
        </p>
      </div>

      <form
        className="space-y-4"
        noValidate
        onSubmit={form.handleSubmit(onRegister)}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="onboarding-email">
            Email
          </label>
          <Input
            autoComplete="email"
            id="onboarding-email"
            placeholder="tu@exemplo.com"
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
            Password
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
            Confirmar password
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
          {isSubmitting ? 'A criar conta…' : 'Criar conta e continuar'}
        </Button>
      </form>
    </section>
  );
}