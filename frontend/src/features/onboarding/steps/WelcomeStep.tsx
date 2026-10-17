import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { t } = useTranslation('onboarding');

  return (
    <section className="space-y-6 text-center">
      <div
        aria-hidden="true"
        className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl"
      >
        🌱
      </div>
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          {t('welcome.eyebrow')}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('welcome.title')}
        </h1>
        <p className="mx-auto max-w-lg leading-7 text-muted-foreground">
          {t('welcome.description')}
        </p>
      </div>
      <Button className="w-full sm:w-auto" onClick={onNext} size="lg" type="button">
        {t('welcome.start')}
      </Button>
    </section>
  );
}