import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  Hammer,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
  return (
    <section
      aria-labelledby="journey-title"
      className="bg-muted/30 py-16 sm:py-24"
      id="como-funciona"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" id="journey-title">
            Como funciona
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Cada passo liga o que aprendes ao que podes fazer a seguir.
          </p>
        </div>
        <ol className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <li key={title}>
              <Card className="h-full transition-transform hover:-translate-y-1">
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon aria-hidden="true" className="size-6" />
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-3xl font-bold tabular-nums text-muted-foreground/40"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </CardHeader>
                <CardContent>
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
