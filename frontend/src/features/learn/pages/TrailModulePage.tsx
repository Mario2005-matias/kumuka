import { useState } from 'react';
import { ArrowLeft, BookOpenCheck, Check, Circle, LockKeyhole } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { ActivityForm } from '@/features/learn/components/ActivityForm';
import { ContentRenderer } from '@/features/learn/components/ContentRenderer';
import { ModuleFooter } from '@/features/learn/components/ModuleFooter';
import { ModuleSidebar } from '@/features/learn/components/ModuleSidebar';
import {
  isAccessibleModule,
  useCompleteModule,
  useCompleteTrail,
  useMarkContentRead,
  useModule,
  useSaveTrailDraft,
  useStartTrail,
  useSubmitTrailActivity,
  useTrailProgress,
} from '@/features/learn/hooks/useTrailFlow';
import { useTrail } from '@/features/learn/hooks/useTrails';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import type { Trail } from '@/types/trail';

function TrailModuleContent({
  trail,
  slug,
  moduleId,
}: {
  trail: Trail;
  slug: string;
  moduleId: string;
}) {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const moduleQuery = useModule(slug, moduleId);
  const progress = useTrailProgress(userId, trail.id);
  const start = useStartTrail(userId, trail);
  const markRead = useMarkContentRead(userId, trail);
  const saveDraft = useSaveTrailDraft(userId, trail);
  const submitActivity = useSubmitTrailActivity(userId, trail);
  const completeModule = useCompleteModule(userId, trail);
  const completeTrail = useCompleteTrail(userId, trail);
  const [actionError, setActionError] = useState<string | null>(null);
  const module = moduleQuery.data;
  const previousModule = trail.modulos.find((item) => item.ordem === (module?.ordem ?? 0) - 1);
  const currentPhase = trail.fases.find((phase) =>
    phase.modulos.some((phaseModule) => phaseModule.id === module?.id),
  );
  const isAccessible = module
    ? isAccessibleModule(trail, progress.data, module.id)
    : false;
  const allContentRead = module
    ? module.contentItems.every((item) =>
        progress.data?.conteudosLidos.includes(item.id),
      )
    : false;
  const activitySubmitted = Boolean(
    module?.atividade &&
      progress.data?.atividadesSubmetidas.includes(module.atividade.id),
  );
  const canAdvance =
    allContentRead &&
    (!module?.atividade?.obrigatoria || activitySubmitted);
  const moduleCompleted = Boolean(
    module && progress.data?.modulosConcluidos.includes(module.id),
  );
  const isLastModule = module?.ordem === trail.modulos.length;
  const primaryLabel = moduleCompleted
    ? isLastModule
      ? 'Ver conclusão'
      : 'Próximo módulo'
    : 'Concluir módulo';

  async function startTrail() {
    setActionError(null);
    try {
      await start.mutateAsync();
    } catch (error: unknown) {
      setActionError(
        error instanceof Error ? error.message : 'Não foi possível iniciar esta trilha.',
      );
    }
  }

  async function finishModule() {
    if (!module) return;
    setActionError(null);
    if (!allContentRead) {
      setActionError('Marca todos os conteúdos como lidos antes de avançar.');
      return;
    }
    if (module.atividade?.obrigatoria && !activitySubmitted) {
      setActionError('Submete a actividade obrigatória antes de avançar.');
      return;
    }
    try {
      const updated = moduleCompleted
        ? progress.data
        : await completeModule.mutateAsync({ moduleId: module.id });
      if (!updated) return;
      const nextModule = trail.modulos.find(
        (item) => !updated.modulosConcluidos.includes(item.id),
      );
      if (updated.estado === 'concluido') {
        await completeTrail.mutateAsync();
        navigate(ROUTES.learn.trailComplete(trail.slug));
      } else if (nextModule) {
        navigate(ROUTES.learn.trailModule(trail.slug, nextModule.id));
      } else {
        setActionError('O módulo foi concluído, mas não foi possível determinar o próximo passo.');
      }
    } catch (error: unknown) {
      setActionError(
        error instanceof Error ? error.message : 'Não foi possível concluir o módulo.',
      );
    }
  }

  if (moduleQuery.isLoading || progress.isLoading) {
    return <p aria-live="polite">A carregar módulo e progresso…</p>;
  }
  if (moduleQuery.isError || progress.isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        Não foi possível carregar o módulo ou o teu progresso. Tenta novamente.
      </p>
    );
  }
  if (!module) {
    return (
      <EmptyState
        description="Volta à trilha para escolher um módulo disponível."
        icon={BookOpenCheck}
        title="Módulo não encontrado"
      />
    );
  }
  if (!progress.data) {
    return (
      <div className="mx-auto max-w-xl space-y-5 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <BookOpenCheck aria-hidden="true" className="mx-auto size-9 text-primary" />
        <h1 className="text-2xl font-bold">Começa esta trilha</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Inicia a trilha para guardar o teu progresso e desbloquear os módulos pela ordem.
        </p>
        {actionError && <p className="text-sm text-destructive" role="alert">{actionError}</p>}
        <Button className="min-h-11" disabled={start.isPending} onClick={() => void startTrail()}>
          {start.isPending ? 'A iniciar…' : 'Começar trilha'}
        </Button>
      </div>
    );
  }
  if (!isAccessible) {
    return (
      <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <LockKeyhole aria-hidden="true" className="mx-auto size-9 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Módulo bloqueado</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Conclui o módulo anterior para desbloquear este conteúdo.
        </p>
        <Button
          className="min-h-11"
          nativeButton={false}
          render={<Link to={ROUTES.learn.trail(trail.slug)} />}
          variant="outline"
        >
          Ver módulos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        action={
          <Button
            className="min-h-11"
            nativeButton={false}
            render={<Link to={ROUTES.learn.trail(trail.slug)} />}
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" />
            Voltar à trilha
          </Button>
        }
        breadcrumb={
          <Link className="hover:text-foreground" to={ROUTES.learn.trail(trail.slug)}>
            {trail.titulo}
          </Link>
        }
        description={module.descricao}
        title={module.titulo}
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <main className="min-w-0 space-y-5">
          <p className="text-sm font-medium text-muted-foreground">
            Fase {currentPhase?.ordem ?? 1} de {trail.totalFases} · Módulo {module.ordem} de {trail.totalModulos}
          </p>
          {module.contentItems.map((item) => {
            const isRead = progress.data?.conteudosLidos.includes(item.id) ?? false;
            return (
              <section className="space-y-3" key={item.id}>
                <ContentRenderer item={item} />
                <Button
                  aria-pressed={isRead}
                  className="min-h-11"
                  disabled={isRead || markRead.isPending}
                  onClick={() => {
                    setActionError(null);
                    void markRead
                      .mutateAsync({ moduleId: module.id, contentId: item.id })
                      .catch((error: unknown) =>
                        setActionError(
                          error instanceof Error
                            ? error.message
                            : 'Não foi possível guardar a leitura.',
                        ),
                      );
                  }}
                  type="button"
                  variant={isRead ? 'secondary' : 'outline'}
                >
                  {isRead ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
                  {isRead ? 'Leitura concluída' : 'Marcar como lido'}
                </Button>
              </section>
            );
          })}
          {module.atividade && (
            <ActivityForm
              activity={module.atividade}
              draft={progress.data?.rascunhosAtividade[module.atividade.id]}
              isSaving={saveDraft.isPending}
              key={module.atividade.id}
              isSubmitting={submitActivity.isPending}
              onMarkComplete={finishModule}
              onSaveDraft={async (answer) => {
                await saveDraft.mutateAsync({ moduleId: module.id, answer });
              }}
              onSubmit={async (answer) => {
                await submitActivity.mutateAsync({ moduleId: module.id, answer });
              }}
              submitted={activitySubmitted}
            />
          )}
          {actionError && <p className="text-sm text-destructive" role="alert">{actionError}</p>}
          {moduleCompleted && (
            <p className="flex items-center gap-2 text-sm font-medium text-success">
              <BookOpenCheck aria-hidden="true" className="size-4" />
              Módulo concluído
            </p>
          )}
        </main>
        <ModuleSidebar
          activeModuleId={module.id}
          progress={progress.data}
          trail={trail}
        />
      </div>
      <ModuleFooter
        disabled={!moduleCompleted && !canAdvance}
        isPending={completeModule.isPending || completeTrail.isPending}
        onPrevious={
          previousModule
            ? () => navigate(ROUTES.learn.trailModule(trail.slug, previousModule.id))
            : undefined
        }
        onPrimary={() => void finishModule()}
        primaryLabel={primaryLabel}
        progressLabel={
          allContentRead
            ? 'Conteúdos lidos'
            : `Lê os conteúdos para avançar (${progress.data.conteudosLidos.filter((id) => module.contentItems.some((item) => item.id === id)).length}/${module.contentItems.length})`
        }
      />
    </div>
  );
}

export default function TrailModulePage() {
  const { slug = '', moduleId = '' } = useParams();
  const trailQuery = useTrail(slug);

  if (trailQuery.isLoading) return <p aria-live="polite">A carregar trilha…</p>;
  if (trailQuery.isError) {
    return <p className="text-sm text-destructive" role="alert">Não foi possível carregar a trilha.</p>;
  }
  if (!trailQuery.data) {
    return (
      <EmptyState
        description="Volta ao catálogo e escolhe uma trilha disponível."
        icon={BookOpenCheck}
        title="Trilha não encontrada"
      />
    );
  }
  return (
    <TrailModuleContent
      moduleId={moduleId}
      slug={slug}
      trail={trailQuery.data}
    />
  );
}
