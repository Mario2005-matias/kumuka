import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  Hammer,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { animateJourney, defaultJourneyOptions } from '../lib/animations/sectionAnimations';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const steps: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Aprender',
    description: 'Descobre ideias e conhecimentos ao teu ritmo.',
    icon: BookOpen,
  },
  {
    title: 'Desenvolver',
    description: 'Pratica e fortalece competências para a vida.',
    icon: TrendingUp,
  },
  {
    title: 'Fazer',
    description: 'Aplica o que aprendeste em projetos e desafios.',
    icon: Hammer,
  },
  {
    title: 'Provar',
    description: 'Guarda resultados e mostra o que sabes fazer.',
    icon: Award,
  },
  {
    title: 'Experimentar',
    description: 'Participa em programas, workshops e eventos.',
    icon: Compass,
  },
  {
    title: 'Avançar',
    description: 'Encontra oportunidades e dá o próximo passo.',
    icon: BriefcaseBusiness,
  },
];

export function JourneySection() {
  const sectionRef = useScrollAnimation(animateJourney, defaultJourneyOptions);

  return (
    <section
      aria-labelledby="journey-title"
      className="relative overflow-hidden bg-surface-1 py-20 sm:py-28"
      id="como-funciona"
      ref={sectionRef}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[image:var(--gradient-glow)] opacity-60"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            data-reveal
            id="journey-title"
          >
            Como funciona
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground" data-reveal>
            Uma jornada clara: do primeiro clique até à oportunidade.
          </p>
        </div>
        <ol
          className="relative mx-auto mt-12 grid max-w-5xl gap-y-5 sm:mt-16 sm:gap-y-7"
          data-journey-list
        >
          <li
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-[1.375rem] top-0 w-px bg-border lg:left-1/2"
          >
            <span
              className="journey-progress-fill absolute inset-0 block origin-top bg-primary"
              data-journey-progress
            />
          </li>
          {steps.map(({ title, description, icon: Icon }, index) => (
            <li
              className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-3 lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] lg:gap-x-6"
              key={title}
            >
              <div
                aria-hidden="true"
                className="relative z-10 col-start-1 row-start-1 mt-5 flex size-11 items-center justify-center rounded-full border border-border bg-card text-sm font-bold tabular-nums text-muted-foreground transition-colors lg:col-start-2"
                data-step-number
              >
                {String(index + 1).padStart(2, '0')}
              </div>
              <Card
                className={`journey-step relative z-10 col-start-2 row-start-1 h-full border border-border/80 bg-card/90 transition-[border-color,box-shadow] duration-300 ${index % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-3'}`}
                data-journey-card
              >
                <CardHeader className={`flex-row items-start justify-between gap-4 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    data-step-icon
                  >
                    <Icon aria-hidden="true" className="size-6" />
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-3xl font-bold tabular-nums text-muted-foreground/30"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </CardHeader>
                <CardContent className={index % 2 === 0 ? 'lg:text-right' : ''}>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <p className="mt-2 leading-6 text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
