import { ONBOARDING_STEPS } from '../types';

interface ProgressStepperProps {
  currentStep: number;
}

export function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const completed = currentStep + 1;

  return (
    <div
      aria-label={`Passo ${completed} de ${ONBOARDING_STEPS.length}`}
      aria-valuemax={ONBOARDING_STEPS.length}
      aria-valuemin={1}
      aria-valuenow={completed}
      className="w-full"
      role="progressbar"
    >
      <div className="mb-2 flex justify-between text-xs text-muted-foreground">
        <span>{ONBOARDING_STEPS[currentStep]}</span>
        <span>
          {completed}/{ONBOARDING_STEPS.length}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[image:var(--gradient-brand)] transition-[width]"
          style={{ width: `${(completed / ONBOARDING_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}