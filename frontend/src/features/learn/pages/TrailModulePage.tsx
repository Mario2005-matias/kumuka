import { useCallback } from 'react';
import { ArrowLeft, BookOpenCheck, LockKeyhole } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { ActivityForm } from '@/features/learn/components/ActivityForm';
import { LessonView } from '@/features/learn/components/LessonView';
import { ModuleFooter } from '@/features/learn/components/ModuleFooter';
import { ModuleSidebar } from '@/features/learn/components/ModuleSidebar';
import {
  useLessonHeartbeat,
  useSaveActivityDraft,
  useStartTrail,
  useSubmitActivity,
  useTrailProgress,
  type HeartbeatInput,
} from '@/features/learn/hooks/useTrailFlow';
import { useTrail, useTrailModule } from '@/features/learn/hooks/useTrails';
import { apiErrorMessage } from '@/lib/api/client';
import { ROUTES } from '@/lib/constants/routes';
import type { Trail, TrailProgress } from '@/types/trail';
import { useTranslation } from 'react-i18next';

function StartTrailCard({ trail }: { trail: Trail }) {
  const { t } = useTranslation('learning');
  const start = useStartTrail(trail);
  return (
    <div className="mx-auto max-w-xl space-y-5 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
      <BookOpenCheck aria-hidden="true" className="mx-auto size-9 text-primary" />
      <h1 className="text-2xl font-bold">{t('trailModule.startTitle')}</h1>
      <p className="text-sm leading-6 text-muted-foreground">{t('trailModule.startDescription')}</p>
      {start.isError && (
        <p className="text-sm text-destructive" role="alert">
          {apiErrorMessage(start.error, t('trailModule.startError'))}
        </p>
      )}
      <Button className="min-h-11" disabled={start.isPending} onClick={() => start.mutate()}>
        {start.isPending ? t('trailModule.starting') : t('trailModule.startAction')}
      </Button>
    </div>
  );
}

function LockedModuleCard({ trail }: { trail: Trail }) {
  const { t } = useTranslation('learning');
  return (
    <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
      <LockKeyhole aria-hidden="true" className="mx-auto size-9 text-muted-foreground" />
      <h1 className="text-2xl font-bold">{t('trailModule.lockedTitle')}</h1>
      <p className="text-sm leading-6 text-muted-foreground">{t('common.unlockPrevious')}</p>
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

function TrailModuleContent({
  trail,
  progress,
  moduleId,
}: {
  trail: Trail;
  progress: TrailProgress;
  moduleId: string;
}) {
  const { t } = useTranslation('learning');
  const navigate = useNavigate();
  const isAccessible = progress.modulosAcessiveis.includes(moduleId);
  const moduleQuery = useTrailModule(trail.slug, moduleId, isAccessible);
  const heartbeat = useLessonHeartbeat(trail.slug);
  const saveDraft = useSaveActivityDraft(trail.slug);
  const submitActivity = useSubmitActivity(trail.slug);
  const sendHeartbeat = heartbeat.mutate;
  const onHeartbeat = useCallback((input: HeartbeatInput) => sendHeartbeat(input), [sendHeartbeat]);

  const modules = trail.modulos ?? [];
  const module = moduleQuery.data;

  if (!isAccessible) return <LockedModuleCard trail={trail} />;
  if (moduleQuery.isLoading) return <p aria-live="polite">{t('trailModule.loading')}</p>;
  if (moduleQuery.isError || !module) {
    return (
      <EmptyState
        description={t('trailModule.notFoundDescription')}
        icon={BookOpenCheck}
        title={t('trailModule.notFoundTitle')}
      />
    );
  }

  const position = modules.findIndex((item) => item.id === module.id);
  const previousModule = position > 0 ? modules[position - 1] : undefined;
  const nextModule = modules[position + 1];
  const phase = trail.fases?.find((item) => item.id === module.faseId);
  const requiredLessons = module.aulas.filter((lesson) => lesson.obrigatoria);
  const completedLessons = requiredLessons.filter((lesson) => progress.aulas[lesson.id]?.concluida).length;
  const activity = module.atividade;
  const activityPending = Boolean(
    activity?.obrigatoria && !progress.atividades[activity.id]?.aprovada,
  );
  const moduleCompleted = progress.modulosConcluidos.includes(module.id);
  const trailCompleted = progress.estado === 'concluido';

  const progressLabel = moduleCompleted
    ? t('trailModule.moduleCompleted')
    : completedLessons < requiredLessons.length
      ? t('trailModule.lessonsToAdvance', { current: completedLessons, total: requiredLessons.length })
      : activityPending
        ? t('trailModule.submitRequiredActivity')
        : t('trailModule.checking');

  function goNext() {
    if (trailCompleted && !nextModule) {
      navigate(ROUTES.learn.trailComplete(trail.slug));
    } else if (nextModule) {
      navigate(ROUTES.learn.trailModule(trail.slug, nextModule.id));
    }
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
            {phase
              ? t('trailModule.phaseAndModule', { phase: phase.ordem, phases: trail.totalFases, module: module.ordem, modules: trail.totalModulos })
              : t('trailModule.moduleOf', { module: module.ordem, modules: trail.totalModulos })}
          </p>
          {module.aulas.map((lesson) => (
            <LessonView
              key={lesson.id}
              lesson={lesson}
              onHeartbeat={onHeartbeat}
              progress={progress.aulas[lesson.id]}
            />
          ))}
          {activity && (
            <ActivityForm
              activity={activity}
              isSaving={saveDraft.isPending}
              isSubmitting={submitActivity.isPending}
              key={activity.id}
              onSaveDraft={(answer) => saveDraft.mutateAsync({ activityId: activity.id, answer })}
              onSubmit={(input) => submitActivity.mutateAsync(input)}
              submission={progress.atividades[activity.id]}
            />
          )}
          {moduleCompleted && (
            <p className="flex items-center gap-2 text-sm font-medium text-success">
              <BookOpenCheck aria-hidden="true" className="size-4" />
              {t('trailModule.moduleCompleted')}
            </p>
          )}
        </main>
        <ModuleSidebar activeModuleId={module.id} progress={progress} trail={trail} />
      </div>
      <ModuleFooter
        disabled={!moduleCompleted}
        onPrevious={
          previousModule
            ? () => navigate(ROUTES.learn.trailModule(trail.slug, previousModule.id))
            : undefined
        }
        onPrimary={goNext}
        primaryLabel={
          nextModule ? t('module.next') : t('trailModule.viewCompletion')
        }
        progressLabel={progressLabel}
      />
    </div>
  );
}

export default function TrailModulePage() {
  const { t } = useTranslation('learning');
  const { slug = '', moduleId = '' } = useParams();
  const trailQuery = useTrail(slug);
  const progress = useTrailProgress(slug);

  if (trailQuery.isLoading || progress.isLoading) {
    return <p aria-live="polite">{t('trailModule.loadingTrail')}</p>;
  }
  if (trailQuery.isError || progress.isError || !trailQuery.data || !progress.data) {
    return (
      <EmptyState
        description={t('trailModule.notFoundTrailDescription')}
        icon={BookOpenCheck}
        title={t('trailModule.notFoundTrailTitle')}
      />
    );
  }
  if (progress.data.estado === 'nao_iniciado') {
    return <StartTrailCard trail={trailQuery.data} />;
  }
  return <TrailModuleContent moduleId={moduleId} progress={progress.data} trail={trailQuery.data} />;
}
