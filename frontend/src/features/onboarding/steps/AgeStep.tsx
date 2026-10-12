import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AgeStepProps {
  value: number | null;
  onChange: (age: number | null) => void;
  onNext: () => void;
}

export function AgeStep({ value, onChange, onNext }: AgeStepProps) {
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (value === null || !Number.isInteger(value) || value < 1 || value > 120) {
      setError('Insere uma idade válida.');
      return;
    }
    setError('');
    onNext();
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Quantos anos tens?</h1>
        <p className="text-muted-foreground">
          Vamos sugerir oportunidades adequadas à tua fase de vida.
        </p>
      </div>
      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="onboarding-age">
            Idade
          </label>
          <Input
            id="onboarding-age"
            inputMode="numeric"
            max="120"
            min="1"
            onChange={(event) => {
              setError('');
              onChange(event.target.value === '' ? null : Number(event.target.value));
            }}
            type="number"
            value={value ?? ''}
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