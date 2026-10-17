import { useState } from 'react';
import { ArrowLeft, ArrowRight, Award, Clock3, Sparkles, Target, Users } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { ModuleList } from '@/features/learn/components/ModuleList';
import { ProgressBar } from '@/features/learn/components/ProgressBar';
import { useStartTrail, useTrailProgress } from '@/features/learn/hooks/useTrailFlow';
import { useTrail } from '@/features/learn/hooks/useTrails';
import { useTrails } from '@/features/learn/hooks/useTrails';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import type { Trail } from '@/types/trail';

function TrailDetails({ trail }: { trail: Trail }) {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const progress = useTrailProgress(userId, trail.id);
  const start = useStartTrail(userId, trail);
  const relatedTrails = useTrails();
  const [actionError, setActionError] = useState<string | null>(null);
  const activeModule = trail.modulos.find(
    (module) => module.id === progress.data?.moduloAtualId,
  );
  const targetModule = activeModule ?? trail.modulos[0];

  async function startOrContinue() {
    if (!targetModule) return;
    setActionError(null);
    try {
      if (!progress.data) await start.mutateAsync();
      navigate(ROUTES.learn.trailModule(trail.slug, targetModule.id));
    } catch (error: unknown) {
      setActionError(
        error instanceof Error ? error.message : 'Não foi possível iniciar esta trilha.',
      );
    }
  }

  const buttonLabel =
    progress.data?.estado === 'concluido'
      ? 'Rever trilha'
      : progress.data
        ? 'Continuar trilha'
        : 'Começar trilha';

  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button
            className="min-h-11"
            nativeButton={false}
            render={<Link to={ROUTES.learn.trails} />}
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" />
            Todas as trilhas
          </Button>
        }
        breadcrumb={
          <Link className="hover:text-foreground" to={ROUTES.learn.trails}>
            Trilhas
          </Link>
        }
        description={trail.descricao}
        title={trail.titulo}
      />
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6">
          <article className="rounded-xl border border-border bg-card p-5 sm:p-7">
            <h2 className="text-lg font-semibold">Sobre esta trilha</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {trail.descricaoLonga}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <StatusBadge status="neutral">{trail.nivel}</StatusBadge>
              <StatusBadge status="info">{trail.categoria}</StatusBadge>
              <StatusBadge status="neutral">{trail.competenciaCentral}</StatusBadge>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 aria-hidden="true" className="size-4 text-primary" />
              {trail.duracao} horas · {trail.totalFases} fases · {trail.totalModulos} módulos
            </div>
          </article>
          <section aria-labelledby="trail-result-title" className="rounded-xl border border-border bg-surface-1 p-5 sm:p-7">
            <h2 className="flex items-center gap-2 font-semibold" id="trail-result-title">
              <Sparkles aria-hidden="true" className="size-5 text-primary" />
              O que vais alcançar
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {trail.resultadoEsperado}
            </p>
          </section>
          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-semibold"><Target aria-hidden="true" className="size-5 text-primary" />O que vais dominar</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                {trail.objetivosAprendizagem.map((objective) => <li key={objective}>{objective}</li>)}
              </ul>
            </article>
            <article className="rounded-xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-semibold"><Users aria-hidden="true" className="size-5 text-primary" />Para quem é</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{trail.publicoAlvo}</p>
            </article>
            <article className="rounded-xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-semibold"><Award aria-hidden="true" className="size-5 text-primary" />Pré-requisitos e certificado</h2>
              {trail.preRequisitos.length ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                  {trail.preRequisitos.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : <p className="mt-3 text-sm text-muted-foreground">Não precisas de experiência prévia.</p>}
              <p className="mt-3 text-sm text-muted-foreground">{trail.certificado ? 'Inclui certificado de conclusão.' : 'Não inclui certificado.'}</p>
            </article>
          </section>
        </div>
        <aside className="h-fit space-y-4 rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-semibold">O teu progresso</p>
          {progress.isLoading ? (
            <p aria-live="polite" className="text-sm text-muted-foreground">
              A carregar progresso…
            </p>
          ) : progress.isError ? (
            <p className="text-sm text-destructive" role="alert">
              Não foi possível carregar o progresso.
            </p>
          ) : progress.data ? (
            <>
              <ProgressBar
                label={`Progresso na trilha ${trail.titulo}`}
                value={progress.data.percentual}
              />
              <p className="text-sm text-muted-foreground">
                {progress.data.percentual}% concluído
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ainda não começaste esta trilha.
            </p>
          )}
          {actionError && (
            <p className="text-sm text-destructive" role="alert">
              {actionError}
            </p>
          )}
          <Button
            className="min-h-11 w-full"
            disabled={progress.isLoading || progress.isError || start.isPending || !targetModule}
            onClick={() => void startOrContinue()}
          >
            {start.isPending ? 'A iniciar…' : buttonLabel}
            <ArrowRight aria-hidden="true" />
          </Button>
          {progress.data?.estado === 'concluido' && (
            <Button
              className="min-h-11 w-full"
              nativeButton={false}
              render={<Link to={ROUTES.learn.trailComplete(trail.slug)} />}
              variant="outline"
            >
              Ver conclusão
            </Button>
          )}
        </aside>
      </section>
      <section aria-labelledby="trail-modules-title" className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Percurso
          </p>
          <h2 className="mt-1 text-2xl font-bold" id="trail-modules-title">
            Módulos da trilha
          </h2>
        </div>
        <ModuleList trail={trail} progress={progress.data ?? undefined} />
      </section>
      {!!relatedTrails.data?.length && (
        <section aria-labelledby="related-trails-title" className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Continua a aprender</p>
            <h2 className="mt-1 text-2xl font-bold" id="related-trails-title">Trilhas relacionadas</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedTrails.data.filter((item) => item.id !== trail.id).slice(0, 3).map((item) => (
              <Link className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50" key={item.id} to={ROUTES.learn.trail(item.slug)}>
                <p className="text-sm text-primary">{item.categoria} · {item.duracao} h</p>
                <h3 className="mt-2 font-semibold">{item.titulo}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.descricao}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section className="flex flex-col items-start justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="font-semibold">Pronto para dar o próximo passo?</h2>
          <p className="mt-1 text-sm text-muted-foreground">Retoma o teu percurso e continua a desenvolver esta competência.</p>
        </div>
        <Button className="min-h-11 w-full sm:w-auto" disabled={progress.isLoading || progress.isError || start.isPending || !targetModule} onClick={() => void startOrContinue()}>
          {start.isPending ? 'A iniciar…' : buttonLabel}
          <ArrowRight aria-hidden="true" />
        </Button>
      </section>
    </div>
  );
}

export default function TrailDetailPage() {
  const { slug = '' } = useParams();
  const trail = useTrail(slug);

  if (trail.isLoading) {
    return <p aria-live="polite">A carregar trilha…</p>;
  }
  if (trail.isError) {
    return <p className="text-sm text-destructive" role="alert">Não foi possível carregar esta trilha.</p>;
  }
  if (!trail.data) {
    return (
      <EmptyState
        description="Volta ao catálogo e escolhe uma trilha disponível."
        icon={Sparkles}
        title="Trilha não encontrada"
      />
    );
  }
  return <TrailDetails trail={trail.data} />;
}
