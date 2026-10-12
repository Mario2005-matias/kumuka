import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NameStepProps {
  value: string;
  onChange: (name: string) => void;
  onNext: () => void;
}

export function NameStep({ value, onChange, onNext }: NameStepProps) {
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (value.trim().length < 2) {
      setError('Escreve pelo menos dois caracteres.');
      return;
    }
    setError('');
    onNext();
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Como te podemos chamar?</h1>
        <p className="text-muted-foreground">
          Partilha o nome que gostas de usar.
        </p>
      </div>
      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="onboarding-name">
            O teu nome
          </label>
          <Input
            autoComplete="given-name"
            autoFocus
            id="onboarding-name"
            onChange={(event) => {
              setError('');
              onChange(event.target.value);
            }}
            placeholder="Por exemplo, Ana"
            value={value}
          />
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
        <Button className="w-full" type="submit">
          Continuar
        </Button>
      </form>
    </section>
  );
}