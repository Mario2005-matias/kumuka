import { Button } from '@/components/ui/button';
import { Confetti } from '../components/Confetti';
import { UnlockReveal } from '../components/UnlockReveal';
import type { OnboardingDraft } from '../types';
import { useTranslation } from 'react-i18next';

interface RewardStepProps {
  draft: OnboardingDraft;
  onComplete: () => void;
}

export function RewardStep({ draft, onComplete }: RewardStepProps) {
  const { t } = useTranslation('onboarding');

  return (
    <section className="space-y-6 text-center">
      <Confetti />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          {draft.name
            ? t('reward.almostNamed', { name: draft.name })
            : t('reward.almost')}
        </h1>
        <p className="text-muted-foreground">
          {t('reward.description')}
        </p>
      </div>
      <UnlockReveal
        description={t('reward.journeyDescription')}
        title={t('reward.journeyTitle')}
      />
      <div className="rounded-xl bg-muted/60 p-4 text-left text-sm">
        <p>
          <span className="font-medium">{t('reward.goal')}</span> {draft.goal}
        </p>
        <p className="mt-2">
          <span className="font-medium">{t('reward.interests')}</span>{' '}
          {draft.interests.join(', ')}
        </p>
      </div>
      <Button className="w-full" onClick={onComplete} size="lg" type="button">
        {t('reward.complete')}
      </Button>
    </section>
  );
}