import { CompanyLogo } from '@/components/shared/CoverImage';
import { MediaCard } from '@/components/shared/MediaCard';
import { BriefcaseBusiness, CalendarDays, MapPin, Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { pageFromSearch } from '@/lib/pagination';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
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
    page: pageFromSearch(searchParams),
  });
  const all = useOpportunities({ pageSize: 50 });
  const areas = [...new Set((all.data?.data ?? []).map((item) => item.area))].sort();
  const companies = [...new Set((all.data?.data ?? []).map((item) => item.empresaNome))].sort();

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('pagina');
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="space-y-8">
      <PageHeader description={t('description')} title={t('title')} />
      <div className="grid gap-3 elevated rounded-2xl border border-border/70 bg-card p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <ErrorState message={t('error')} onRetry={() => void opportunities.refetch()} />
      ) : opportunities.data?.data.length ? (
        <>
          <p aria-live="polite" className="text-sm text-muted-foreground">{t('results', { count: opportunities.data.meta.total })}</p>
          <section aria-label={t('resultList')} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {opportunities.data.data.map((item) => (
              <MediaCard
                aside={<span className="text-xs text-muted-foreground">{t('daysRemaining', { count: daysRemaining(item.prazo) })}</span>}
                category={t(typeTranslationKeys[item.tipo])}
                description={item.subtitulo}
                image={item.banner}
                key={item.id}
                overlay={<CompanyLogo className="size-11 rounded-xl text-sm" name={item.empresaNome} src={item.empresaLogo} />}
                title={item.titulo}
                to={ROUTES.opportunities.detail(item.slug)}
              >
                <p className="text-sm font-medium">{item.empresaNome} · {item.area}</p>
                <dl className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><MapPin aria-hidden="true" className="size-3.5 text-primary" /><dt className="sr-only">{t('locationLabel')}</dt><dd>{item.localizacao} · {t(modalityTranslationKeys[item.modalidade])}</dd></div>
                  <div className="flex items-center gap-2"><CalendarDays aria-hidden="true" className="size-3.5 text-primary" /><dt className="sr-only">{t('deadlineLabel')}</dt><dd>{t('until', { date: dateLabel(item.prazo, dateLocale) })}</dd></div>
                </dl>
              </MediaCard>
            ))}
          </section>
          <Pagination
            meta={opportunities.data.meta}
            onPageChange={(next) => {
              const params = new URLSearchParams(searchParams);
              params.set('pagina', String(next));
              setSearchParams(params);
            }}
          />
        </>
      ) : (
        <EmptyState description={t('emptyDescription')} icon={BriefcaseBusiness} title={t('emptyTitle')} />
      )}
    </div>
  );
}
