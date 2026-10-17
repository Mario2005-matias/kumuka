import { Button } from '@/components/ui/button';
import { SelectableCard } from '../components/SelectableCard';
import { GOAL_OPTIONS } from '../types';
import { useTranslation } from 'react-i18next';

const goalKeys = {
  'Aprender uma nova competência': 'skill',
  'Preparar-me para o primeiro emprego': 'firstJob',
  'Criar o meu próprio negócio': 'business',
  'Crescer no meu trabalho atual': 'career',
  'Descobrir o que quero fazer': 'explore',
} as const;

interface GoalStepProps {
  value: string;
  onChange: (goal: string) => void;
  onNext: () => void;
}

export function GoalStep({ value, onChange, onNext }: GoalStepProps) {
  const { t } = useTranslation('onboarding');

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t('goal.title')}</h1>
        <p className="text-muted-foreground">
          {t('goal.description')}
        </p>
      </div>
      <div className="grid gap-3">
        {GOAL_OPTIONS.map((option) => (
          <SelectableCard
            key={option}
            onSelect={() => onChange(option)}
            selected={value === option}
            title={t(`options.goals.${goalKeys[option]}`)}
          />
        ))}
      </div>
      <Button className="w-full" disabled={!value} onClick={onNext} type="button">
        {t('credentials.continue')}
      </Button>
    </section>
  );
}