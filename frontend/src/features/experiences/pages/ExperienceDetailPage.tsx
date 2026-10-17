import { useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, MapPin, UsersRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  useExperience,
  useExperiences,
  useRegisterExperience,
} from '@/features/experiences/hooks/useExperiences';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import type { ExperienceModality, TipoExperiencia } from '@/types/experience';
import { useTranslation } from 'react-i18next';

const typeTranslationKeys: Record<
  TipoExperiencia,
  'filters.programme' | 'filters.workshop' | 'filters.event' | 'filters.mentoring' | 'filters.challenge' | 'filters.visit'
> = {
  programa: 'filters.programme',
  workshop: 'filters.workshop',
  evento: 'filters.event',
  mentoria: 'filters.mentoring',
  desafio: 'filters.challenge',
  visita: 'filters.visit',
};
const modalityTranslationKeys: Record<ExperienceModality, 'filters.online' | 'filters.inPerson' | 'filters.hybrid'> = {
  online: 'filters.online',
  presencial: 'filters.inPerson',
  hibrido: 'filters.hybrid',
};
function dateLabel(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(new Date(`${date}T12:00:00`));
}

export default function ExperienceDetailPage() {
  const { t, i18n } = useTranslation('experiences');
  const dateLocale = i18n.resolvedLanguage === 'pt' ? 'pt-AO' : i18n.resolvedLanguage ?? 'pt-AO';
  const { slug = '' } = useParams();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const experience = useExperience(slug, userId);
  const allExperiences = useExperiences(undefined, userId);
  const register = useRegisterExperience(userId);
  const [actionError, setActionError] = useState<string | null>(null);

  async function join() {
    if (!experience.data) return;
    setActionError(null);
    try {
      await register.mutateAsync(experience.data.id);
    } catch (error: unknown) {
      setActionError(error instanceof Error ? error.message : t('detail.registrationError'));
    }
  }

  if (experience.isLoading) return <div aria-label={t('loading')} className="h-72 animate-pulse rounded-xl bg-surface-2" />;
  if (experience.isError) return <ErrorState message={t('detail.error')} onRetry={() => void experience.refetch()} />;
  if (!experience.data) {
    return <EmptyState description={t('detail.notFoundDescription')} icon={CalendarDays} title={t('detail.notFoundTitle')} />;
  }

  const item = experience.data;
  const alreadyRegistered = item.estado === 'inscrita';
  const full = item.estado === 'sem-vagas';
  const closed = item.estado === 'encerrada';
  const relatedCandidates = (allExperiences.data ?? []).filter((entry) => entry.id !== item.id);
  const relatedOfType = relatedCandidates.filter((entry) => entry.tipo === item.tipo);
  const related = [
    ...relatedOfType,
    ...relatedCandidates.filter((entry) => entry.tipo !== item.tipo),
  ].slice(0, 3);

  return (
    <div className="space-y-8">
      <div aria-hidden="true" className="flex aspect-[16/6] min-h-40 items-end rounded-2xl bg-[image:var(--gradient-surface)] p-5 sm:p-8">
        <StatusBadge status="info">{t(typeTranslationKeys[item.tipo])}</StatusBadge>
      </div>
      <PageHeader
        action={<Button className="min-h-11" nativeButton={false} render={<Link to={ROUTES.experiences.root} />} variant="outline"><ArrowLeft aria-hidden="true" />{t('detail.back')}</Button>}
        breadcrumb={<Link className="hover:text-foreground" to={ROUTES.experiences.root}>{t('title')}</Link>}
        description={item.subtitulo}
        title={item.titulo}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
            <h2 className="font-semibold">{t('detail.about')}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.descricaoLonga}</p>
            <p className="mt-4 text-sm text-muted-foreground">{t('detail.organizedBy')} <span className="font-medium text-foreground">{item.organizador}</span></p>
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold">{t('detail.benefits')}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{item.beneficios.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold">{t('detail.requirements')}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{item.requisitos.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>
            </div>
          </section>
          <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
            <h2 className="font-semibold">{t('detail.schedule')}</h2>
            <ol className="mt-4 space-y-4">
              {item.programa.map((entry) => (
                <li className="grid gap-2 border-l-2 border-primary/40 pl-4 sm:grid-cols-[4rem_1fr]" key={`${entry.hora}-${entry.titulo}`}>
                  <time className="text-sm font-semibold text-primary">{entry.hora}</time>
                  <div><h3 className="font-medium">{entry.titulo}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.descricao}</p></div>
                </li>
              ))}
            </ol>
          </section>
          <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
            <h2 className="font-semibold">{t('detail.speakers')}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {item.oradores.map((speaker) => (
                <article className="rounded-lg border border-border p-4" key={speaker.nome}>
                  <h3 className="font-medium">{speaker.nome}</h3>
                  <p className="mt-1 text-sm text-primary">{speaker.cargo} · {speaker.empresa}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{speaker.bio}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
        <aside className="h-fit space-y-4 rounded-xl border border-border bg-card p-5">
          <dl className="space-y-4 text-sm">
            <div className="flex gap-3"><CalendarDays aria-hidden="true" className="mt-0.5 size-4 text-primary" /><div><dt className="font-medium">{t('detail.dateTime')}</dt><dd className="mt-1 text-muted-foreground">{dateLabel(item.data, dateLocale)} · {item.hora}</dd></div></div>
            <div className="flex gap-3"><MapPin aria-hidden="true" className="mt-0.5 size-4 text-primary" /><div><dt className="font-medium">{t('detail.locationAndModality')}</dt><dd className="mt-1 text-muted-foreground">{item.local}{item.localDetalhado ? ` · ${item.localDetalhado}` : ''} · {t(modalityTranslationKeys[item.modalidade])}</dd></div></div>
            <div className="flex gap-3"><UsersRound aria-hidden="true" className="mt-0.5 size-4 text-primary" /><div><dt className="font-medium">{t('detail.vacancies')}</dt><dd className="mt-1 text-muted-foreground">{item.vagasOcupadas}/{item.vagas} {t('filled')}</dd></div></div>
          </dl>
          {actionError && <p className="text-sm text-destructive" role="alert">{actionError}</p>}
          <Button className="min-h-11 w-full" disabled={alreadyRegistered || full || closed || register.isPending} onClick={() => void join()}>
            {register.isPending ? t('detail.registering') : alreadyRegistered ? t('detail.alreadyRegistered') : full ? t('status.full') : closed ? t('status.closed') : t('detail.join')}
          </Button>
          {alreadyRegistered && <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 aria-hidden="true" className="size-4" />{t('detail.registrationSaved')}</p>}
        </aside>
      </div>
      {!!allExperiences.data?.length && (
        <section aria-labelledby="related-experiences-title" className="space-y-4">
          <h2 className="text-xl font-semibold" id="related-experiences-title">{t('detail.related')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((entry) => (
              <Link className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50" key={entry.id} to={ROUTES.experiences.detail(entry.slug)}>
                <p className="text-sm text-primary">{t(typeTranslationKeys[entry.tipo])} · {entry.local}</p>
                <h3 className="mt-2 font-semibold">{entry.titulo}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{entry.subtitulo}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
