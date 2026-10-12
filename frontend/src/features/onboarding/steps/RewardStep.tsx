import { Button } from '@/components/ui/button';
import { Confetti } from '../components/Confetti';
import { UnlockReveal } from '../components/UnlockReveal';
import type { OnboardingDraft } from '../types';

interface RewardStepProps {
  draft: OnboardingDraft;
  onComplete: () => void;
}

export function RewardStep({ draft, onComplete }: RewardStepProps) {
  return (
    <section className="space-y-6 text-center">
      <Confetti />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          {draft.name ? `Estás quase, ${draft.name}!` : 'Estás quase!'}
        </h1>
        <p className="text-muted-foreground">
          O teu perfil está pronto para desbloquear novas possibilidades.
        </p>
      </div>
      <UnlockReveal
        description="A tua jornada começa com recomendações alinhadas com os teus interesses e objetivos."
        title="A tua jornada KUMUKA"
      />
      <div className="rounded-xl bg-muted/60 p-4 text-left text-sm">
        <p>
          <span className="font-medium">Objetivo:</span> {draft.goal}
        </p>
        <p className="mt-2">
          <span className="font-medium">Interesses:</span>{' '}
          {draft.interests.join(', ')}
        </p>
      </div>
      <Button className="w-full" onClick={onComplete} size="lg" type="button">
        Concluir o meu perfil
      </Button>
    </section>
  );
}