import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';
import { useOnboardingStore } from '../store';

export default function OnboardingCompletePage() {
  const name = useOnboardingStore((state) => state.draft.name);
  const complete = useOnboardingStore((state) => state.complete);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <section className="w-full max-w-lg space-y-6 rounded-2xl border bg-background p-8 text-center shadow-sm">
        <div
          aria-hidden="true"
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-3xl"
        >
          🎉
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            {name ? `Parabéns, ${name}!` : 'Parabéns!'}
          </h1>
          <p className="leading-7 text-muted-foreground">
            O teu perfil KUMUKA está pronto. A tua próxima oportunidade começa
            agora.
          </p>
        </div>
        <Button
          className="w-full"
          nativeButton={false}
          onClick={complete}
          render={<Link to={ROUTES.dashboard} />}
        >
          Explorar a KUMUKA
        </Button>
      </section>
    </main>
  );
}