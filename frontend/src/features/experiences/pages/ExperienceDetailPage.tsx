import { ArrowLeft, CalendarDays, MapPin, UsersRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ROUTES } from '@/lib/constants/routes';
import { useExperience } from '../hooks/useExperiences';

export default function ExperienceDetailPage() {
  const { slug = '' } = useParams();
  const experience = useExperience(slug);

  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button
            nativeButton={false}
            render={<Link to={ROUTES.experiences.root} />}
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" />
            Voltar a Experiências
          </Button>
        }
        description="Detalhes da experiência."
        title={experience.data?.titulo ?? 'Experiência'}
      />
      {experience.isLoading ? (
        <p aria-live="polite" className="text-sm text-muted-foreground">A carregar experiência…</p>
      ) : experience.isError ? (
        <ErrorState message="Não foi possível carregar esta experiência." />
      ) : experience.data ? (
        <article className="space-y-6 rounded-xl border border-border bg-card p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {experience.data.descricao}
            </p>
            <StatusBadge
              status={
                experience.data.estado === 'inscrita'
                  ? 'success'
                  : experience.data.estado === 'sem-vagas'
                    ? 'warning'
                    : experience.data.estado === 'futura'
                      ? 'neutral'
                      : 'info'
              }
            >
              {experience.data.estado === 'inscrita'
                ? 'Inscrita'
                : experience.data.estado === 'sem-vagas'
                  ? 'Sem vagas'
                  : experience.data.estado === 'futura'
                    ? 'Futura'
                    : 'Com vagas'}
            </StatusBadge>
          </div>
          <dl className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <CalendarDays aria-hidden="true" className="mt-0.5 size-4 text-primary" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Data</dt>
                <dd className="mt-1 text-sm">{experience.data.data}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 text-primary" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Local</dt>
                <dd className="mt-1 text-sm">{experience.data.local} · {experience.data.modalidade}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UsersRound aria-hidden="true" className="mt-0.5 size-4 text-primary" />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Vagas</dt>
                <dd className="mt-1 text-sm">
                  {Math.max(experience.data.vagas - experience.data.vagasOcupadas, 0)} de {experience.data.vagas}
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Organização</dt>
              <dd className="mt-1 text-sm">{experience.data.organizador}</dd>
            </div>
          </dl>
        </article>
      ) : (
        <EmptyState
          description="Volta à lista para escolher outra experiência."
          icon={CalendarDays}
          title="Experiência não encontrada"
        />
      )}
    </div>
  );
}
