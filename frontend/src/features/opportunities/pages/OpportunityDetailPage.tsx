import { useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  useApplyToOpportunity,
  useOpportunities,
  useOpportunity,
  useOpportunityApplications,
} from '@/features/opportunities/hooks/useOpportunities';
import { useCompany } from '@/features/opportunities/hooks/useCompany';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import type { TipoOportunidade } from '@/types/opportunity';
import type { ExperienceModality } from '@/types/experience';
import { useTranslation } from 'react-i18next';

const typeTranslationKeys: Record<
  TipoOportunidade,
  'types.internship' | 'types.job' | 'types.trainee' | 'types.scholarship' | 'types.programme' |
  'types.mentoring' | 'types.challenge' | 'types.contest' | 'types.volunteering'
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
const modalityTranslationKeys: Record<ExperienceModality, 'filters.hybrid' | 'filters.inPerson' | 'filters.online'> = {
  hibrido: 'filters.hybrid',
  presencial: 'filters.inPerson',
  online: 'filters.online',
};

function dateLabel(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(`${date}T12:00:00`));
}

export default function OpportunityDetailPage() {
  const { t, i18n } = useTranslation('opportunities');
  const dateLocale = i18n.resolvedLanguage === 'pt' ? 'pt-AO' : i18n.resolvedLanguage ?? 'pt-AO';
  const { slug = '' } = useParams();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const opportunity = useOpportunity(slug);
  const company = useCompany(opportunity.data?.empresaId ?? '');
  const applications = useOpportunityApplications(userId);
  const apply = useApplyToOpportunity(userId);
  const all = useOpportunities();
  const [actionError, setActionError] = useState<string | null>(null);

  async function submit() {
    if (!opportunity.data) return;
    setActionError(null);
    try {
      await apply.mutateAsync(opportunity.data.id);
    } catch (error: unknown) {
      setActionError(error instanceof Error ? error.message : t('detail.actionError'));
    }
  }

  if (opportunity.isLoading) return <div aria-label={t('loading')} className="h-72 animate-pulse rounded-xl bg-surface-2" />;
  if (opportunity.isError) return <ErrorState message={t('detail.error')} onRetry={() => void opportunity.refetch()} />;
  if (!opportunity.data) return <EmptyState description={t('detail.notFoundDescription')} icon={BriefcaseBusiness} title={t('detail.notFoundTitle')} />;

  const item = opportunity.data;
  const existing = applications.data?.find((application) => application.opportunityId === item.id);
  const expired = item.estado !== 'aberta' || new Date(`${item.prazo}T23:59:59`) < new Date();
  const ctaLabel = existing
    ? item.ctaTipo === 'interesse' ? t('detail.interestRegistered') : t('detail.applicationRegistered')
    : expired
      ? t('detail.deadlineClosed')
      : item.ctaTipo === 'interesse' ? t('interest') : t('apply');
  const relatedCandidates = (all.data ?? []).filter((entry) => entry.id !== item.id);
  const relatedInArea = relatedCandidates.filter((entry) => entry.area === item.area);
  const related = [
    ...relatedInArea,
    ...relatedCandidates.filter((entry) => entry.area !== item.area),
  ].slice(0, 3);

  return (
    <div className="space-y-8">
      <div aria-hidden="true" className="flex aspect-[16/6] min-h-40 items-end justify-between rounded-2xl bg-[image:var(--gradient-surface)] p-5 sm:p-8">
        <StatusBadge status="info">{t(typeTranslationKeys[item.tipo])}</StatusBadge>
        <div className="flex size-16 items-center justify-center rounded-xl border border-border bg-card text-xl font-bold text-primary">{item.empresaNome.slice(0, 2).toLocaleUpperCase()}</div>
      </div>
      <PageHeader
        action={<Button className="min-h-11" nativeButton={false} render={<Link to={ROUTES.opportunities.root} />} variant="outline"><ArrowLeft aria-hidden="true" />{t('detail.back')}</Button>}
        breadcrumb={<Link className="hover:text-foreground" to={ROUTES.opportunities.root}>{t('title')}</Link>}
        description={item.subtitulo}
        title={item.titulo}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
            <h2 className="font-semibold">{t('detail.about')}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.descricaoLonga}</p>
            <h3 className="mt-5 font-semibold">{t('detail.aboutCompany', { company: item.empresaNome })}</h3>
            {company.isLoading ? (
              <p aria-live="polite" className="mt-2 text-sm text-muted-foreground">{t('detail.loadingCompany')}</p>
            ) : company.isError ? (
              <p className="mt-2 text-sm text-destructive" role="alert">{t('detail.companyError')}</p>
            ) : company.data ? (
              <>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{company.data.descricao}</p>
                {company.data.cultura && <p className="mt-2 text-sm leading-6 text-muted-foreground">{company.data.cultura}</p>}
                {company.data.website && <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href={company.data.website} rel="noreferrer" target="_blank">{t('detail.visitWebsite')}</a>}
              </>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('detail.companyFallback', { company: item.empresaNome })}</p>
            )}
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">{t('detail.responsibilities')}</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{item.responsabilidades.map((entry) => <li key={entry}>{entry}</li>)}</ul></div>
            <div className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">{t('detail.requirements')}</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{item.requisitos.map((entry) => <li key={entry}>{entry}</li>)}</ul></div>
          </section>
          <section className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">{t('detail.benefits')}</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{item.beneficios.map((entry) => <li key={entry}>{entry}</li>)}</ul></section>
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold">{t('detail.howToApply')}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.ctaDestino ? t('detail.externalApplication') : item.ctaTipo === 'interesse' ? t('detail.registerInterest') : t('detail.registerApplication')}</p>
          </section>
        </div>
        <aside className="h-fit space-y-4 rounded-xl border border-border bg-card p-5">
          <dl className="space-y-4 text-sm">
            <div className="flex gap-3"><MapPin aria-hidden="true" className="mt-0.5 size-4 text-primary" /><div><dt className="font-medium">{t('detail.locationAndModality')}</dt><dd className="mt-1 text-muted-foreground">{item.localizacao} · {t(modalityTranslationKeys[item.modalidade])}</dd></div></div>
            <div className="flex gap-3"><CalendarDays aria-hidden="true" className="mt-0.5 size-4 text-primary" /><div><dt className="font-medium">{t('deadlineLabel')}</dt><dd className="mt-1 text-muted-foreground">{dateLabel(item.prazo, dateLocale)}</dd></div></div>
          </dl>
          {applications.isError && <p className="text-sm text-destructive" role="alert">{t('detail.applicationStatusError')}</p>}
          {actionError && <p className="text-sm text-destructive" role="alert">{actionError}</p>}
          {item.ctaDestino && !existing && !expired ? (
            <Button className="min-h-11 w-full" nativeButton={false} render={<a href={item.ctaDestino} rel="noreferrer" target="_blank" />}>{ctaLabel}</Button>
          ) : (
            <Button className="min-h-11 w-full" disabled={Boolean(existing) || expired || apply.isPending || applications.isLoading || applications.isError} onClick={() => void submit()}>
              {apply.isPending ? t('detail.registering') : ctaLabel}
            </Button>
          )}
          {existing && <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 aria-hidden="true" className="size-4" />{t('detail.applicationSaved')}</p>}
        </aside>
      </div>
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('detail.related')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((entry) => <Link className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50" key={entry.id} to={ROUTES.opportunities.detail(entry.slug)}><p className="text-sm text-primary">{entry.empresaNome} · {entry.area}</p><h3 className="mt-2 font-semibold">{entry.titulo}</h3><p className="mt-2 text-sm text-muted-foreground">{entry.localizacao} · {t('until', { date: dateLabel(entry.prazo, dateLocale) })}</p></Link>)}
          </div>
        </section>
      )}
    </div>
  );
}
