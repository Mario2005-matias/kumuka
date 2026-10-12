import { Button } from '@/components/ui/button';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
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
          O teu próximo capítulo começa aqui
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Bem-vindo à KUMUKA
        </h1>
        <p className="mx-auto max-w-lg leading-7 text-muted-foreground">
          Vamos conhecer-te melhor para te ajudar a descobrir oportunidades,
          desenvolver competências e avançar ao teu ritmo.
        </p>
      </div>
      <Button className="w-full sm:w-auto" onClick={onNext} size="lg" type="button">
        Vamos começar
      </Button>
    </section>
  );
}