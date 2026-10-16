import { ArrowDown, ArrowRight, BriefcaseBusiness, BookOpen, Sparkles, Target, Wrench } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGsapContext } from '../hooks/useGsapContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { animateHero } from '../lib/animations/heroAnimations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

const journey = [
  { label: 'Aprender', icon: BookOpen },
  { label: 'Fazer', icon: Wrench },
  { label: 'Provar', icon: Target },
  { label: 'Oportunidades', icon: BriefcaseBusiness, highlight: true },
];

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  useGsapContext(heroRef, animateHero, !prefersReducedMotion);

  return (
    <section
      className="relative isolate overflow-hidden bg-background"
      ref={heroRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--gradient-glow)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <div className="container mx-auto grid min-h-[calc(100svh-4rem)] items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
          <Badge
            className="mb-6 rounded-full border border-primary/20 px-3 py-1 text-secondary-foreground"
            data-hero-badge
            variant="secondary"
          >
            <Sparkles aria-hidden="true" className="mr-1 size-3.5" />
            Líderes do Futuro · Angola · 2026
          </Badge>
          <h1
            aria-label="Constrói o teu futuro."
            className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            <span aria-hidden="true" className="inline-block">
              <span className="inline-block" data-hero-word>Constrói</span>{' '}
              <span className="inline-block" data-hero-word>o teu</span>{' '}
              <span
                className="inline-block bg-[image:var(--gradient-brand)] bg-clip-text text-transparent"
                data-hero-word
              >
                futuro.
              </span>
            </span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0"
            data-hero-copy
          >
            Aprende, desenvolve competências, constrói o teu portefólio e
            encontra oportunidades — tudo num só lugar.
          </p>
          <div
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            data-hero-actions
          >
            <Button
              className="min-h-11 w-full px-6 py-3 transition-transform hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] sm:w-auto"
              nativeButton={false}
              render={<Link to={ROUTES.onboarding.root} />}
              size="lg"
            >
              Começar agora
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              className="min-h-11 w-full px-6 py-3 transition-transform hover:scale-[1.02] sm:w-auto"
              nativeButton={false}
              render={<Link to={ROUTES.auth.login} />}
              size="lg"
              variant="outline"
            >
              Já tenho conta
            </Button>
          </div>
          <a
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            data-hero-scroll
            href="#o-que-e-a-kumuka"
          >
            Descobrir como funciona
            <ArrowDown aria-hidden="true" className="size-4" />
          </a>
        </div>

        <div
          aria-label="A jornada KUMUKA: aprender, fazer, provar e encontrar oportunidades"
          className="relative mx-auto w-full max-w-xl rounded-3xl border border-border/80 bg-card/85 p-4 shadow-2xl shadow-primary/10 backdrop-blur sm:p-7"
          role="img"
        >
          <p className="mb-5 text-sm font-semibold text-muted-foreground sm:mb-7">
            O teu caminho, passo a passo
          </p>
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
            {journey.map(({ label, icon: Icon, highlight }, index) => (
              <li
                className="relative flex flex-col items-center"
                data-hero-journey-step
                key={label}
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl ${
                    highlight
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  <Icon aria-hidden="true" className="size-6" />
                </div>
                <span
                  className={`mt-3 text-center text-xs font-semibold sm:text-sm ${
                    highlight ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {label}
                </span>
                {index < journey.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute -right-3 top-5 hidden size-4 text-muted-foreground sm:block"
                  />
                )}
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-2xl bg-secondary/70 p-4 sm:mt-8 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Target aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="font-semibold">Aprender é só o começo</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Leva o que sabes para novas oportunidades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
