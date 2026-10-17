import { CalendarDays, MapPin, Search, UsersRound, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/constants/routes';
import type { Experience, ExperienceModality, TipoExperiencia } from '@/types/experience';
import { useTranslation } from 'react-i18next';

const selectClass = 'min-h-11 w-full rounded-lg border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm';
const typeTranslationKeys: Record<
  TipoExperiencia,
  | 'filters.programme'
  | 'filters.workshop'
  | 'filters.event'
  | 'filters.mentoring'
  | 'filters.challenge'
  | 'filters.visit'
> = {
  programa: 'filters.programme',
  workshop: 'filters.workshop',
  evento: 'filters.event',
  mentoria: 'filters.mentoring',
  desafio: 'filters.challenge',
  visita: 'filters.visit',
};
const types: { value: TipoExperiencia }[] = [
  { value: 'programa' },
  { value: 'workshop' },
  { value: 'evento' },
  { value: 'mentoria' },
  { value: 'desafio' },
  { value: 'visita' },
];
const modalityTranslationKeys: Record<
  ExperienceModality,
  'filters.online' | 'filters.inPerson' | 'filters.hybrid'
> = {
  online: 'filters.online',
  presencial: 'filters.inPerson',
  hibrido: 'filters.hybrid',
};

function readState(experience: Experience) {
  if (experience.estado === 'inscrita') return { key: 'status.enrolled' as const, tone: 'success' as const };
  if (experience.estado === 'sem-vagas') return { key: 'status.full' as const, tone: 'warning' as const };
  if (experience.estado === 'encerrada') return { key: 'status.closed' as const, tone: 'neutral' as const };
  return { key: 'status.available' as const, tone: 'info' as const };
}

function dateLabel(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(`${date}T12:00:00`));
}

export default function ExperiencesPage() {
  const { t, i18n } = useTranslation('experiences');
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const search = searchParams.get('q') ?? '';
  const tipo = searchParams.get('tipo') ?? '';
  const modalidade = searchParams.get('modalidade') ?? '';
  const periodo = searchParams.get('periodo') ?? '';
  const localizacao = searchParams.get('localizacao') ?? '';
  const dateLocale = i18n.resolvedLanguage === 'pt' ? 'pt-AO' : i18n.resolvedLanguage ?? 'pt-AO';
  const experiences = useExperiences({
    search: search || undefined,
    tipo: types.some((item) => item.value === tipo) ? tipo as TipoExperiencia : undefined,
    modalidade: ['online', 'presencial', 'hibrido'].includes(modalidade)
      ? modalidade as ExperienceModality
      : undefined,
    periodo: ['semana', 'mes', 'tres-meses'].includes(periodo)
      ? periodo as 'semana' | 'mes' | 'tres-meses'
      : undefined,
    localizacao: localizacao || undefined,
  }, userId);

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  function clear() {
    setSearchParams({}, { replace: true });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description={t('description')}
        title={t('title')}
      />
      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(15rem,2fr)_repeat(4,minmax(9rem,1fr))_auto] xl:items-end">
        <div className="relative sm:col-span-2 xl:col-span-1">
          <label className="mb-2 block text-sm font-medium" htmlFor="experience-search">{t('filters.search')}</label>
          <Search aria-hidden="true" className="absolute left-3 top-[2.65rem] size-4 text-muted-foreground" />
          <Input className="min-h-11 pl-9" id="experience-search" onChange={(event) => update('q', event.currentTarget.value)} placeholder={t('filters.searchPlaceholder')} value={search} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="experience-type">{t('filters.type')}</label>
          <select className={selectClass} id="experience-type" onChange={(event) => update('tipo', event.currentTarget.value)} value={tipo}>
            <option value="">{t('filters.allTypes')}</option>{types.map((item) => <option key={item.value} value={item.value}>{t(typeTranslationKeys[item.value])}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="experience-mode">{t('filters.modality')}</label>
          <select className={selectClass} id="experience-mode" onChange={(event) => update('modalidade', event.currentTarget.value)} value={modalidade}>
            <option value="">{t('filters.allModalities')}</option><option value="online">{t('filters.online')}</option><option value="presencial">{t('filters.inPerson')}</option><option value="hibrido">{t('filters.hybrid')}</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="experience-date">{t('filters.date')}</label>
          <select className={selectClass} id="experience-date" onChange={(event) => update('periodo', event.currentTarget.value)} value={periodo}>
            <option value="">{t('filters.anyDate')}</option><option value="semana">{t('filters.thisWeek')}</option><option value="mes">{t('filters.thisMonth')}</option><option value="tres-meses">{t('filters.nextThreeMonths')}</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="experience-location">{t('filters.location')}</label>
          <Input className="min-h-11" id="experience-location" onChange={(event) => update('localizacao', event.currentTarget.value)} placeholder={t('filters.locationPlaceholder')} value={localizacao} />
        </div>
        <Button className="min-h-11 w-full sm:col-span-2 xl:col-span-1" onClick={clear} type="button" variant="outline">
          <X aria-hidden="true" />{t('filters.clear')}
        </Button>
      </div>
      {experiences.isLoading ? (
        <section aria-label={t('loading')} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => <div aria-hidden="true" className="h-96 animate-pulse rounded-xl border border-border bg-card p-5" key={index}><div className="h-36 rounded-lg bg-surface-2" /><div className="mt-5 h-5 w-3/4 rounded bg-surface-2" /><div className="mt-3 h-4 w-1/2 rounded bg-surface-2" /><div className="mt-8 h-11 rounded-lg bg-surface-2" /></div>)}
        </section>
      ) : experiences.isError ? (
        <ErrorState message={t('error')} onRetry={() => void experiences.refetch()} />
      ) : experiences.data?.length ? (
        <section aria-label={t('results')} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {experiences.data.map((experience) => {
            const state = readState(experience);
            return (
              <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card" key={experience.id}>
                <div aria-hidden="true" className="flex aspect-[16/8] items-end bg-[image:var(--gradient-surface)] p-5">
                  <StatusBadge status="info">{t(typeTranslationKeys[experience.tipo])}</StatusBadge>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold">{experience.titulo}</h2>
                    <StatusBadge className="shrink-0" status={state.tone}>{t(state.key)}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{experience.subtitulo}</p>
                  <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4 text-primary" /><dt className="sr-only">{t('dateLabel')}</dt><dd>{dateLabel(experience.data, dateLocale)} · {experience.hora}</dd></div>
                    <div className="flex items-center gap-2"><MapPin aria-hidden="true" className="size-4 text-primary" /><dt className="sr-only">{t('locationLabel')}</dt><dd>{experience.local} · {t(modalityTranslationKeys[experience.modalidade])}</dd></div>
                    <div className="flex items-center gap-2"><UsersRound aria-hidden="true" className="size-4 text-primary" /><dt className="sr-only">{t('vacanciesLabel')}</dt><dd>{experience.vagasOcupadas}/{experience.vagas} {t('filled')}</dd></div>
                  </dl>
                  <Button className="mt-auto min-h-11 w-full pt-5" nativeButton={false} render={<Link to={ROUTES.experiences.detail(experience.slug)} />}>
                    {t('learnMore')}
                  </Button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <EmptyState description={t('emptyDescription')} icon={CalendarDays} title={t('emptyTitle')} />
      )}
    </div>
  );
}
