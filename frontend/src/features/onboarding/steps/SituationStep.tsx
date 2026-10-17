import { Button } from '@/components/ui/button';
import { SelectableCard } from '../components/SelectableCard';
import { SITUATION_OPTIONS } from '../types';
import { useTranslation } from 'react-i18next';

const situationKeys = {
  'Estou a estudar': 'studying',
  'Estou à procura de trabalho': 'jobSearch',
  'Já estou a trabalhar': 'working',
  'Tenho um negócio ou projeto': 'business',
  'Outra situação': 'other',
} as const;

interface SituationStepProps {
  value: string;
  onChange: (situation: string) => void;
  onNext: () => void;
}

export function SituationStep({ value, onChange, onNext }: SituationStepProps) {
  const { t } = useTranslation('onboarding');

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t('situation.title')}</h1>
        <p className="text-muted-foreground">
          {t('situation.description')}
        </p>
      </div>
      <div className="grid gap-3">
        {SITUATION_OPTIONS.map((option) => (
          <SelectableCard
            key={option}
            onSelect={() => onChange(option)}
            selected={value === option}
            title={t(`options.situations.${situationKeys[option]}`)}
          />
        ))}
      </div>
      <Button className="w-full" disabled={!value} onClick={onNext} type="button">
        {t('credentials.continue')}
      </Button>
    </section>
  );
}