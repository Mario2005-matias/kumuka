import { ArrowDown, ArrowRight, BriefcaseBusiness, BookOpen, Target, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-primary/5 blur-3xl sm:size-96"
      />
      <div className="container grid min-h-[34rem] items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
          <Badge className="mb-6 rounded-full px-3 py-1" variant="secondary">
            Líderes do Futuro · Angola · 2026
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Constrói o teu{' '}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              futuro.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0">
            Aprende, desenvolve competências, constrói o teu portefólio e
            encontra oportunidades — tudo num só lugar.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button
              className="min-h-11 w-full sm:w-auto"
              nativeButton={false}
              render={<Link to={ROUTES.onboarding.root} />}
              size="lg"
            >
              Começar agora
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              className="min-h-11 w-full sm:w-auto"
              nativeButton={false}
              render={<Link to={ROUTES.auth.login} />}
              size="lg"
              variant="outline"
            >
              Já tenho conta
            </Button>
          </div>
          <a
            className="mt-8 inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
            href="#o-que-e-a-kumuka"
          >
            Descobrir como funciona
            <ArrowDown aria-hidden="true" className="size-4" />
          </a>
        </div>

        <div
          aria-label="A jornada KUMUKA: aprender, fazer, provar e encontrar oportunidades"
          className="mx-auto w-full max-w-xl rounded-3xl border bg-card/80 p-4 shadow-xl shadow-primary/5 backdrop-blur sm:p-7"
          role="img"
        >
          <p className="mb-5 text-sm font-semibold text-muted-foreground sm:mb-7">
            O teu caminho, passo a passo
          </p>
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
            {journey.map(({ label, icon: Icon, highlight }, index) => (
              <li className="relative flex flex-col items-center" key={label}>
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
