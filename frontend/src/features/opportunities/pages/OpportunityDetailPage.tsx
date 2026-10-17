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

function dateLabel(date: string) {
  return new Intl.DateTimeFormat('pt-AO', { dateStyle: 'long' }).format(new Date(`${date}T12:00:00`));
}

function modalityLabel(modality: string) {
  return modality === 'hibrido' ? 'híbrido' : modality;
}

export default function OpportunityDetailPage() {
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
      setActionError(error instanceof Error ? error.message : 'Não foi possível registar a candidatura.');
    }
  }

  if (opportunity.isLoading) return <div aria-label="A carregar oportunidade" className="h-72 animate-pulse rounded-xl bg-surface-2" />;
  if (opportunity.isError) return <ErrorState message="Não foi possível carregar esta oportunidade." onRetry={() => void opportunity.refetch()} />;
  if (!opportunity.data) return <EmptyState description="Volta à lista para escolher outra oportunidade." icon={BriefcaseBusiness} title="Oportunidade não encontrada" />;

  const item = opportunity.data;
  const existing = applications.data?.find((application) => application.opportunityId === item.id);
  const expired = item.estado !== 'aberta' || new Date(`${item.prazo}T23:59:59`) < new Date();
  const ctaLabel = existing
    ? item.ctaTipo === 'interesse' ? 'Interesse registado ✓' : 'Candidatura registada ✓'
    : expired
      ? 'Prazo encerrado'
      : item.ctaTipo === 'interesse' ? 'Manifestar interesse' : 'Candidatar-me';
  const relatedCandidates = (all.data ?? []).filter((entry) => entry.id !== item.id);
  const relatedInArea = relatedCandidates.filter((entry) => entry.area === item.area);
  const related = [
    ...relatedInArea,
    ...relatedCandidates.filter((entry) => entry.area !== item.area),
  ].slice(0, 3);

  return (
    <div className="space-y-8">
      <div aria-hidden="true" className="flex aspect-[16/6] min-h-40 items-end justify-between rounded-2xl bg-[image:var(--gradient-surface)] p-5 sm:p-8">
        <StatusBadge status="info">{item.tipo}</StatusBadge>
        <div className="flex size-16 items-center justify-center rounded-xl border border-border bg-card text-xl font-bold text-primary">{item.empresaNome.slice(0, 2).toLocaleUpperCase()}</div>
      </div>
      <PageHeader
        action={<Button className="min-h-11" nativeButton={false} render={<Link to={ROUTES.opportunities.root} />} variant="outline"><ArrowLeft aria-hidden="true" />Voltar às oportunidades</Button>}
        breadcrumb={<Link className="hover:text-foreground" to={ROUTES.opportunities.root}>Oportunidades</Link>}
        description={item.subtitulo}
        title={item.titulo}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
            <h2 className="font-semibold">Sobre a oportunidade</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.descricaoLonga}</p>
            <h3 className="mt-5 font-semibold">Sobre {item.empresaNome}</h3>
            {company.isLoading ? (
              <p aria-live="polite" className="mt-2 text-sm text-muted-foreground">A carregar informação da empresa…</p>
            ) : company.isError ? (
              <p className="mt-2 text-sm text-destructive" role="alert">Não foi possível carregar o perfil da empresa.</p>
            ) : company.data ? (
              <>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{company.data.descricao}</p>
                {company.data.cultura && <p className="mt-2 text-sm leading-6 text-muted-foreground">{company.data.cultura}</p>}
                {company.data.website && <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href={company.data.website} rel="noreferrer" target="_blank">Visitar o website da empresa</a>}
              </>
            ) : (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.empresaNome} partilha esta oportunidade com jovens interessados em desenvolver competências.</p>
            )}
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">Responsabilidades</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{item.responsabilidades.map((entry) => <li key={entry}>{entry}</li>)}</ul></div>
            <div className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">Requisitos</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{item.requisitos.map((entry) => <li key={entry}>{entry}</li>)}</ul></div>
          </section>
          <section className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">Benefícios</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{item.beneficios.map((entry) => <li key={entry}>{entry}</li>)}</ul></section>
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold">Como te candidatares</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.ctaDestino ? 'Segue a ligação externa para concluir o processo de candidatura.' : item.ctaTipo === 'interesse' ? 'Regista o teu interesse e a equipa entrará em contacto com os próximos passos.' : 'Regista a tua candidatura. O estado ficará guardado no teu perfil de demonstração.'}</p>
          </section>
        </div>
        <aside className="h-fit space-y-4 rounded-xl border border-border bg-card p-5">
          <dl className="space-y-4 text-sm">
            <div className="flex gap-3"><MapPin aria-hidden="true" className="mt-0.5 size-4 text-primary" /><div><dt className="font-medium">Localização e modalidade</dt><dd className="mt-1 text-muted-foreground">{item.localizacao} · {modalityLabel(item.modalidade)}</dd></div></div>
            <div className="flex gap-3"><CalendarDays aria-hidden="true" className="mt-0.5 size-4 text-primary" /><div><dt className="font-medium">Prazo</dt><dd className="mt-1 text-muted-foreground">{dateLabel(item.prazo)}</dd></div></div>
          </dl>
          {applications.isError && <p className="text-sm text-destructive" role="alert">Não foi possível verificar o estado da candidatura.</p>}
          {actionError && <p className="text-sm text-destructive" role="alert">{actionError}</p>}
          {item.ctaDestino && !existing && !expired ? (
            <Button className="min-h-11 w-full" nativeButton={false} render={<a href={item.ctaDestino} rel="noreferrer" target="_blank" />}>{ctaLabel}</Button>
          ) : (
            <Button className="min-h-11 w-full" disabled={Boolean(existing) || expired || apply.isPending || applications.isLoading || applications.isError} onClick={() => void submit()}>
              {apply.isPending ? 'A registar…' : ctaLabel}
            </Button>
          )}
          {existing && <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 aria-hidden="true" className="size-4" />O teu registo foi guardado.</p>}
        </aside>
      </div>
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Oportunidades relacionadas</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((entry) => <Link className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50" key={entry.id} to={ROUTES.opportunities.detail(entry.slug)}><p className="text-sm text-primary">{entry.empresaNome} · {entry.area}</p><h3 className="mt-2 font-semibold">{entry.titulo}</h3><p className="mt-2 text-sm text-muted-foreground">{entry.localizacao} · até {dateLabel(entry.prazo)}</p></Link>)}
          </div>
        </section>
      )}
    </div>
  );
}
