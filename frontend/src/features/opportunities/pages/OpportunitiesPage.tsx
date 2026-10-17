import { BriefcaseBusiness, CalendarDays, MapPin, Search, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOpportunities } from '@/features/opportunities/hooks/useOpportunities';
import { ROUTES } from '@/lib/constants/routes';
import type { Opportunity, TipoOportunidade } from '@/types/opportunity';
import { useTranslation } from 'react-i18next';

const types: { value: TipoOportunidade }[] = [
  { value: 'estagio' },
  { value: 'emprego' },
  { value: 'trainee' },
  { value: 'bolsa' },
  { value: 'programa' },
];
const typeTranslationKeys: Record<
  TipoOportunidade,
  | 'types.internship'
  | 'types.job'
  | 'types.trainee'
  | 'types.scholarship'
  | 'types.programme'
  | 'types.mentoring'
  | 'types.challenge'
  | 'types.contest'
  | 'types.volunteering'
> = {
  estagio: 'types.internship',
  emprego: 'types.job',
  trainee: 'types.trainee',
  bolsa: 'types.scholarship',
  programa: 'types.programme',
  mentoria: 'types.mentoring',
  desafio: 'types.challenge',
  concurso: 'types.contest',
  voluntariado: 'types.volunteering',
};
const modalityTranslationKeys: Record<
  Opportunity['modalidade'],
  'filters.hybrid' | 'filters.inPerson' | 'filters.online'
> = {
  hibrido: 'filters.hybrid',
  presencial: 'filters.inPerson',
  online: 'filters.online',
};
const selectClass = 'min-h-11 w-full rounded-lg border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm';

function dateLabel(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(`${date}T12:00:00`));
}

function daysRemaining(date: string) {
  return Math.max(0, Math.ceil((new Date(`${date}T23:59:59`).getTime() - Date.now()) / 86_400_000));
}

export default function OpportunitiesPage() {
  const { t, i18n } = useTranslation('opportunities');
  const dateLocale = i18n.resolvedLanguage === 'pt' ? 'pt-AO' : i18n.resolvedLanguage ?? 'pt-AO';
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const type = searchParams.get('tipo') ?? '';
  const area = searchParams.get('area') ?? '';
  const company = searchParams.get('empresa') ?? '';
  const location = searchParams.get('localizacao') ?? '';
  const modality = searchParams.get('modalidade') ?? '';
  const deadline = searchParams.get('prazo') ?? '';
  const opportunities = useOpportunities({
    search: search || undefined,
    tipo: types.some((item) => item.value === type) ? type as TipoOportunidade : undefined,
    area: area || undefined,
    empresa: company || undefined,
    localizacao: location || undefined,
    modalidade: ['online', 'presencial', 'hibrido'].includes(modality)
      ? modality as Opportunity['modalidade']
      : undefined,
    prazo: ['semana', 'mes', 'tres-meses'].includes(deadline)
      ? deadline as 'semana' | 'mes' | 'tres-meses'
      : undefined,
  });
  const all = useOpportunities();
  const areas = [...new Set((all.data ?? []).map((item) => item.area))].sort();
  const companies = [...new Set((all.data ?? []).map((item) => item.empresaNome))].sort();

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="space-y-8">
      <PageHeader description={t('description')} title={t('title')} />
      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="relative sm:col-span-2">
          <label className="mb-2 block text-sm font-medium" htmlFor="opportunity-search">{t('filters.search')}</label>
          <Search aria-hidden="true" className="absolute left-3 top-[2.65rem] size-4 text-muted-foreground" />
          <Input className="min-h-11 pl-9" id="opportunity-search" onChange={(event) => update('q', event.currentTarget.value)} placeholder={t('filters.searchPlaceholder')} value={search} />
        </div>
        <div><label className="mb-2 block text-sm font-medium" htmlFor="opportunity-type">{t('filters.type')}</label><select className={selectClass} id="opportunity-type" onChange={(event) => update('tipo', event.currentTarget.value)} value={type}><option value="">{t('filters.all')}</option>{types.map((item) => <option key={item.value} value={item.value}>{t(typeTranslationKeys[item.value])}</option>)}</select></div>
        <div><label className="mb-2 block text-sm font-medium" htmlFor="opportunity-area">{t('filters.area')}</label><select className={selectClass} id="opportunity-area" onChange={(event) => update('area', event.currentTarget.value)} value={area}><option value="">{t('filters.allAreas')}</option>{areas.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div><label className="mb-2 block text-sm font-medium" htmlFor="opportunity-company">{t('filters.company')}</label><select className={selectClass} id="opportunity-company" onChange={(event) => update('empresa', event.currentTarget.value)} value={company}><option value="">{t('filters.allCompanies')}</option>{companies.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div><label className="mb-2 block text-sm font-medium" htmlFor="opportunity-location">{t('filters.location')}</label><Input className="min-h-11" id="opportunity-location" onChange={(event) => update('localizacao', event.currentTarget.value)} placeholder={t('filters.locationPlaceholder')} value={location} /></div>
        <div><label className="mb-2 block text-sm font-medium" htmlFor="opportunity-modality">{t('filters.modality')}</label><select className={selectClass} id="opportunity-modality" onChange={(event) => update('modalidade', event.currentTarget.value)} value={modality}><option value="">{t('filters.allModalities')}</option><option value="presencial">{t('filters.inPerson')}</option><option value="online">{t('filters.online')}</option><option value="hibrido">{t('filters.hybrid')}</option></select></div>
        <div><label className="mb-2 block text-sm font-medium" htmlFor="opportunity-deadline">{t('filters.deadline')}</label><select className={selectClass} id="opportunity-deadline" onChange={(event) => update('prazo', event.currentTarget.value)} value={deadline}><option value="">{t('filters.anyDeadline')}</option><option value="semana">{t('filters.thisWeek')}</option><option value="mes">{t('filters.thisMonth')}</option><option value="tres-meses">{t('filters.nextThreeMonths')}</option></select></div>
        <Button className="min-h-11" onClick={() => setSearchParams({}, { replace: true })} type="button" variant="outline"><X aria-hidden="true" />{t('filters.clear')}</Button>
      </div>
      {opportunities.isLoading ? (
        <section aria-label={t('loading')} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div aria-hidden="true" className="h-72 animate-pulse rounded-xl bg-surface-2" key={index} />)}</section>
      ) : opportunities.isError ? (
        <ErrorState message="Não foi possível carregar as oportunidades." onRetry={() => void opportunities.refetch()} />
      ) : opportunities.data?.length ? (
        <>
          <p aria-live="polite" className="text-sm text-muted-foreground">{t('results', { count: opportunities.data.length })}</p>
          <section aria-label={t('resultList')} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {opportunities.data.map((item) => (
              <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card" key={item.id}>
                <div className="flex min-h-28 items-center justify-between bg-surface-1 p-5">
                  <div className="flex size-14 items-center justify-center rounded-xl border border-border bg-card text-lg font-bold text-primary">{item.empresaNome.slice(0, 2).toLocaleUpperCase()}</div>
                  <StatusBadge status="info">{t(typeTranslationKeys[item.tipo])}</StatusBadge>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-semibold">{item.titulo}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.subtitulo}</p>
                  <p className="mt-3 text-sm font-medium">{item.empresaNome} · {item.area}</p>
                  <dl className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><MapPin aria-hidden="true" className="size-4 text-primary" /><dt className="sr-only">{t('locationLabel')}</dt><dd>{item.localizacao} · {t(modalityTranslationKeys[item.modalidade])}</dd></div>
                    <div className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-4 text-primary" /><dt className="sr-only">{t('deadlineLabel')}</dt><dd>{t('until', { date: dateLabel(item.prazo, dateLocale) })} · {t('daysRemaining', { count: daysRemaining(item.prazo) })}</dd></div>
                  </dl>
                  <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">{item.requisitos.slice(0, 3).map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>
                  <Button className="mt-auto min-h-11 w-full pt-5" nativeButton={false} render={<Link to={ROUTES.opportunities.detail(item.slug)} />}>{item.ctaTipo === 'interesse' ? t('interest') : t('apply')}</Button>
                </div>
              </article>
            ))}
          </section>
        </>
      ) : (
        <EmptyState description={t('emptyDescription')} icon={BriefcaseBusiness} title={t('emptyTitle')} />
      )}
    </div>
  );
}
