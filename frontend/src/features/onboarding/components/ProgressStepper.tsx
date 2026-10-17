import { ONBOARDING_STEPS } from '../types';
import { useTranslation } from 'react-i18next';

const stepKeys = [
  'welcome',
  'credentials',
  'name',
  'age',
  'situation',
  'interests',
  'goal',
  'reward',
] as const;

interface ProgressStepperProps {
  currentStep: number;
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const { t } = useTranslation('onboarding');
  const completed = currentStep + 1;
  const total = ONBOARDING_STEPS.length;

  return (
    <div
      aria-label={t('progress', { current: completed, total })}
      aria-valuemax={total}
      aria-valuemin={1}
      aria-valuenow={completed}
      className="w-full"
      role="progressbar"
    >
      <div className="mb-2 flex justify-between text-xs text-muted-foreground">
        <span>{t(`steps.${stepKeys[currentStep]}`)}</span>
        <span>
          {completed}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[image:var(--gradient-brand)] transition-[width]"
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </div>
    </div>
  );
}