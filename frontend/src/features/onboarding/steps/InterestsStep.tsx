import { Button } from '@/components/ui/button';
import { ChipMultiSelect } from '../components/ChipMultiSelect';
import { INTEREST_OPTIONS } from '../types';
import { useTranslation } from 'react-i18next';

const interestKeys = {
  Tecnologia: 'technology',
  Empreendedorismo: 'entrepreneurship',
  Criatividade: 'creativity',
  Liderança: 'leadership',
  Finanças: 'finance',
  Comunicação: 'communication',
  Ciência: 'science',
  Empregabilidade: 'employability',
} as const;

interface InterestsStepProps {
  value: string[];
  onChange: (interests: string[]) => void;
  onNext: () => void;
}

export function InterestsStep({ value, onChange, onNext }: InterestsStepProps) {
  const { t } = useTranslation('onboarding');

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t('interests.title')}</h1>
        <p className="text-muted-foreground">
          {t('interests.description')}
        </p>
      </div>
      <ChipMultiSelect
        label={t('interests.label')}
        onToggle={(interest) =>
          onChange(
            value.includes(interest)
              ? value.filter((selected) => selected !== interest)
              : [...value, interest],
          )
        }
        getLabel={(option) =>
          t(`options.interests.${interestKeys[option as keyof typeof interestKeys]}`)
        }
        options={INTEREST_OPTIONS}
        selected={value}
      />
      <Button
        className="w-full"
        disabled={value.length === 0}
        onClick={onNext}
        type="button"
      >
        {t('credentials.continue')}
      </Button>
    </section>
  );
}