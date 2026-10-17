import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface AgeStepProps {
  value: number | null;
  onChange: (age: number | null) => void;
  onNext: () => void;
}

export function AgeStep({ value, onChange, onNext }: AgeStepProps) {
  const { t } = useTranslation('onboarding');
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (value === null || !Number.isInteger(value) || value < 1 || value > 120) {
      setError(true);
      return;
    }
    setError(false);
    onNext();
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t('age.title')}</h1>
        <p className="text-muted-foreground">
          {t('age.description')}
        </p>
      </div>
      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="onboarding-age">
            {t('age.label')}
          </label>
          <Input
            id="onboarding-age"
            inputMode="numeric"
            max="120"
            min="1"
            onChange={(event) => {
              setError(false);
              onChange(event.target.value === '' ? null : Number(event.target.value));
            }}
            type="number"
            value={value ?? ''}
          />
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {t('age.invalid')}
            </p>
          )}
        </div>
        <Button className="w-full" type="submit">
          {t('credentials.continue')}
        </Button>
      </form>
    </section>
  );
}