import {
  ArrowRight,
  CalendarDays,
  Compass,
  MapPin,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ROUTES } from '@/lib/constants/routes';
import { useExperiences } from '../hooks/useExperiences';

const experienceTypes = [
  {
    title: 'Workshops',
    description: 'Aprende e pratica em sessões orientadas.',
    icon: UsersRound,
  },
  {
    title: 'Eventos',
    description: 'Conhece pessoas e explora novas áreas.',
    icon: CalendarDays,
  },
  {
    title: 'Programas',
    description: 'Participa em iniciativas de desenvolvimento.',
    icon: Compass,
  },
];

function statusLabel(status: 'inscrita' | 'aberta' | 'sem-vagas' | 'futura') {
  if (status === 'inscrita') return { label: 'Inscrita', tone: 'success' as const };
  if (status === 'sem-vagas') return { label: 'Sem vagas', tone: 'warning' as const };
  if (status === 'futura') return { label: 'Futura', tone: 'neutral' as const };
  return { label: 'Com vagas', tone: 'info' as const };
}

export default function ExperiencesPage() {
  const experiences = useExperiences();

  return (
    <div className="space-y-8">
      <PageHeader
        description="Sai da teoria, experimenta e conhece novas possibilidades."
        title="Experiências"
      />

      <Card className="overflow-hidden border-border bg-[image:var(--gradient-surface)]">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-4 text-xl font-semibold tracking-tight">
              Aprende também pela experiência
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Workshops, eventos e programas podem ajudar-te a pôr competências
              em prática e descobrir o que queres fazer a seguir.
            </p>
          </div>
          <Button
            className="w-full sm:w-auto"
            nativeButton={false}
            render={<Link to={ROUTES.learn.root} />}
            variant="outline"
          >
            Preparar-me para participar
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </Card>

      <section aria-labelledby="experience-types-title" className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Descobrir
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight" id="experience-types-title">
            Formas de experimentar
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {experienceTypes.map(({ title, description, icon: Icon }) => (
            <Card className="border-border transition-colors hover:border-primary/50" key={title}>
              <CardContent className="flex items-start gap-4 p-5 sm:p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <SectionCard
        description="Programas, encontros e actividades com datas e locais definidos."
        title="Explora oportunidades"
      >
        {experiences.isLoading ? (
          <p aria-live="polite" className="text-sm text-muted-foreground">A carregar experiências…</p>
        ) : experiences.isError ? (
          <ErrorState message="Não foi possível carregar as experiências." />
        ) : experiences.data?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {experiences.data.map((experience) => {
              const state = statusLabel(experience.estado);
              return (
                <Card className="flex flex-col border-border" key={experience.id}>
                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold">{experience.titulo}</h3>
                      <StatusBadge className="shrink-0" status={state.tone}>{state.label}</StatusBadge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{experience.descricao}</p>
                    <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays aria-hidden="true" className="size-4 text-primary" />
                        <dt className="sr-only">Data</dt>
                        <dd>{experience.data}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin aria-hidden="true" className="size-4 text-primary" />
                        <dt className="sr-only">Local</dt>
                        <dd>{experience.local} · {experience.modalidade}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <UsersRound aria-hidden="true" className="size-4 text-primary" />
                        <dt className="sr-only">Vagas</dt>
                        <dd>{Math.max(experience.vagas - experience.vagasOcupadas, 0)} vagas disponíveis</dd>
                      </div>
                    </dl>
                    <Button
                      className="mt-auto pt-6"
                      nativeButton={false}
                      render={<Link to={ROUTES.experiences.detail(experience.slug)} />}
                      variant="ghost"
                    >
                      Ver detalhes
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            className="border-0 bg-transparent py-5"
            description="Neste momento, não há experiências para mostrar."
            icon={MapPin}
            title="Ainda não há experiências disponíveis"
          />
        )}
      </SectionCard>
    </div>
  );
}
