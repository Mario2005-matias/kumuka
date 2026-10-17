import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

interface NameStepProps {
  value: string;
  onChange: (name: string) => void;
  onNext: () => void;
}

export function NameStep({ value, onChange, onNext }: NameStepProps) {
  const { t } = useTranslation('onboarding');
  const [error, setError] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (value.trim().length < 2) {
      setError(true);
      return;
    }
    setError(false);
    onNext();
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t('name.title')}</h1>
        <p className="text-muted-foreground">
          {t('name.description')}
        </p>
      </div>
      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="onboarding-name">
            {t('name.label')}
          </label>
          <Input
            autoComplete="given-name"
            autoFocus
            id="onboarding-name"
            onChange={(event) => {
              setError(false);
              onChange(event.target.value);
            }}
            placeholder={t('name.placeholder')}
            value={value}
          />
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {t('name.minLength')}
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