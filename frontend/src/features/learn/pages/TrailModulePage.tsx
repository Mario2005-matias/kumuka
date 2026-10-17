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
import { useTranslation } from 'react-i18next';

function TrailModuleContent({
  trail,
  slug,
  moduleId,
}: {
  trail: Trail;
  slug: string;
  moduleId: string;
}) {
  const { t } = useTranslation('learning');
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
      ? t('trailModule.viewCompletion')
      : t('module.next')
    : t('module.markComplete');

  async function startTrail() {
    setActionError(null);
    try {
      await start.mutateAsync();
    } catch (error: unknown) {
      setActionError(
        error instanceof Error ? error.message : t('trailModule.startError'),
      );
    }
  }

  async function finishModule() {
    if (!module) return;
    setActionError(null);
    if (!allContentRead) {
      setActionError(t('trailModule.readAllBeforeAdvance'));
      return;
    }
    if (module.atividade?.obrigatoria && !activitySubmitted) {
      setActionError(t('trailModule.submitRequiredActivity'));
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
        setActionError(t('trailModule.nextStepError'));
      }
    } catch (error: unknown) {
      setActionError(
        error instanceof Error ? error.message : t('trailModule.completeError'),
      );
    }
  }

  if (moduleQuery.isLoading || progress.isLoading) {
    return <p aria-live="polite">{t('trailModule.loading')}</p>;
  }
  if (moduleQuery.isError || progress.isError) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {t('trailModule.loadError')}
      </p>
    );
  }
  if (!module) {
    return (
      <EmptyState
        description={t('trailModule.notFoundDescription')}
        icon={BookOpenCheck}
        title={t('trailModule.notFoundTitle')}
      />
    );
  }
  if (!progress.data) {
    return (
      <div className="mx-auto max-w-xl space-y-5 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <BookOpenCheck aria-hidden="true" className="mx-auto size-9 text-primary" />
        <h1 className="text-2xl font-bold">{t('trailModule.startTitle')}</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {t('trailModule.startDescription')}
        </p>
        {actionError && <p className="text-sm text-destructive" role="alert">{actionError}</p>}
        <Button className="min-h-11" disabled={start.isPending} onClick={() => void startTrail()}>
          {start.isPending ? t('trailModule.starting') : t('trailModule.startAction')}
        </Button>
      </div>
    );
  }
  if (!isAccessible) {
    return (
      <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <LockKeyhole aria-hidden="true" className="mx-auto size-9 text-muted-foreground" />
        <h1 className="text-2xl font-bold">{t('trailModule.lockedTitle')}</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {t('common.unlockPrevious')}
        </p>
        <Button
          className="min-h-11"
          nativeButton={false}
          render={<Link to={ROUTES.learn.trail(trail.slug)} />}
          variant="outline"
        >
          {t('trailDetails.modules')}
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
            {t('trailModule.back')}
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
            {t('trailModule.phaseAndModule', { phase: currentPhase?.ordem ?? 1, phases: trail.totalFases, module: module.ordem, modules: trail.totalModulos })}
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
                            : t('trailModule.readError'),
                        ),
                      );
                  }}
                  type="button"
                  variant={isRead ? 'secondary' : 'outline'}
                >
                  {isRead ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
                  {isRead ? t('trailModule.readCompleted') : t('trailModule.markRead')}
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
              {t('trailModule.moduleCompleted')}
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
            ? t('trailModule.allContentRead')
            : t('trailModule.readToAdvance', { current: progress.data.conteudosLidos.filter((id) => module.contentItems.some((item) => item.id === id)).length, total: module.contentItems.length })
        }
      />
    </div>
  );
}

export default function TrailModulePage() {
  const { t } = useTranslation('learning');
  const { slug = '', moduleId = '' } = useParams();
  const trailQuery = useTrail(slug);

  if (trailQuery.isLoading) return <p aria-live="polite">{t('trailModule.loadingTrail')}</p>;
  if (trailQuery.isError) {
    return <p className="text-sm text-destructive" role="alert">{t('trailModule.loadTrailError')}</p>;
  }
  if (!trailQuery.data) {
    return (
      <EmptyState
        description={t('trailModule.notFoundTrailDescription')}
        icon={BookOpenCheck}
        title={t('trailModule.notFoundTrailTitle')}
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
