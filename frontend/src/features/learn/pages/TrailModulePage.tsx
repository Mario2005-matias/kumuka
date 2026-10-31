import { useCallback, useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, ClipboardCheck, LockKeyhole } from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { ActivityForm } from '@/features/learn/components/ActivityForm';
import { LessonView } from '@/features/learn/components/LessonView';
import { ModuleFooter } from '@/features/learn/components/ModuleFooter';
import { ModuleSidebar } from '@/features/learn/components/ModuleSidebar';
import {
  useMarkLessonRead,
  useSaveActivityDraft,
  useStartTrail,
  useSubmitActivity,
  useSubmitCheckpoint,
  useTrailProgress,
  useVideoHeartbeat,
} from '@/features/learn/hooks/useTrailFlow';
import { useTrail, useTrailModule } from '@/features/learn/hooks/useTrails';
import { apiErrorMessage } from '@/lib/api/client';
import { ROUTES } from '@/lib/constants/routes';
import type { Trail, TrailModule, TrailProgress } from '@/types/trail';
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
      <Button className="min-h-11" nativeButton={false} render={<Link to={ROUTES.learn.trail(trail.slug)} />} variant="outline">
        {t('trailDetails.modules')}
      </Button>
    </div>
  );
}

function QuizCard({ trail, module, progress, lessonsDone }: { trail: Trail; module: TrailModule; progress: TrailProgress; lessonsDone: boolean }) {
  const { t } = useTranslation('learning');
  const quiz = progress.quizzes[module.id];
  if (!module.quiz) return null;
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-highlight/50 bg-highlight/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex gap-3">
        <ClipboardCheck aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-primary" />
        <div>
          <h2 className="font-semibold">{t('quiz.moduleQuizTitle')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {quiz?.aprovado
              ? t('quiz.passedWith', { score: quiz.melhorNota ?? 0 })
              : lessonsDone
                ? t('quiz.ready', { count: module.quiz.perguntas, score: module.quiz.notaMinima })
                : t('quiz.lockedUntilLessons')}
          </p>
        </div>
      </div>
      <Button
        className="min-h-11 shrink-0"
        disabled={!lessonsDone}
        nativeButton={false}
        render={<Link to={ROUTES.learn.moduleQuiz(trail.slug, module.id)} />}
        variant={quiz?.aprovado ? 'outline' : 'default'}
      >
        {quiz?.aprovado ? t('quiz.reviewQuiz') : t('quiz.startQuiz')}
        <ArrowRight aria-hidden="true" />
      </Button>
    </section>
  );
}

function TrailModuleContent({ trail, progress, moduleId }: { trail: Trail; progress: TrailProgress; moduleId: string }) {
  const { t } = useTranslation('learning');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAccessible = progress.modulosAcessiveis.includes(moduleId);
  const moduleQuery = useTrailModule(trail.slug, moduleId, isAccessible);
  const heartbeat = useVideoHeartbeat(trail.slug);
  const markRead = useMarkLessonRead(trail.slug);
  const checkpoint = useSubmitCheckpoint(trail.slug);
  const saveDraft = useSaveActivityDraft(trail.slug);
  const submitActivity = useSubmitActivity(trail.slug);
  const sendHeartbeat = heartbeat.mutate;
  const onVideoPosition = useCallback(
    (blockId: string, position: number) => sendHeartbeat({ blockId, position }),
    [sendHeartbeat],
  );

  const modules = trail.modulos ?? [];
  const module = moduleQuery.data;
  const lessonParam = searchParams.get('aula');
  const initialLessonId = module
    ? (module.aulas.find((item) => !progress.aulas[item.id]?.concluida) ?? module.aulas[0])?.id
    : undefined;

  // Pin the lesson in the URL so completing it does not jump to the next one.
  useEffect(() => {
    if (!lessonParam && initialLessonId) setSearchParams({ aula: initialLessonId }, { replace: true });
  }, [initialLessonId, lessonParam, setSearchParams]);

  if (!isAccessible) return <LockedModuleCard trail={trail} />;
  if (moduleQuery.isLoading) return <p aria-live="polite">{t('trailModule.loading')}</p>;
  if (moduleQuery.isError || !module) {
    return <EmptyState description={t('trailModule.notFoundDescription')} icon={BookOpenCheck} title={t('trailModule.notFoundTitle')} />;
  }

  const lessons = module.aulas;
  const lesson = lessons.find((item) => item.id === (lessonParam ?? initialLessonId)) ?? lessons[0];
  const lessonIndex = lesson ? lessons.indexOf(lesson) : -1;
  const nextLesson = lessons[lessonIndex + 1];
  const requiredLessons = lessons.filter((item) => item.obrigatoria);
  const completedLessons = requiredLessons.filter((item) => progress.aulas[item.id]?.concluida).length;
  const lessonsDone = completedLessons === requiredLessons.length;

  const position = modules.findIndex((item) => item.id === module.id);
  const previousModule = position > 0 ? modules[position - 1] : undefined;
  const nextModule = modules[position + 1];
  const phase = trail.fases?.find((item) => item.id === module.faseId);
  const activity = module.atividade;
  const moduleCompleted = progress.modulosConcluidos.includes(module.id);

  const progressLabel = moduleCompleted
    ? t('trailModule.moduleCompleted')
    : !lessonsDone
      ? t('trailModule.lessonsToAdvance', { current: completedLessons, total: requiredLessons.length })
      : module.quiz && !progress.quizzes[module.id]?.aprovado
        ? t('quiz.passToAdvance')
        : t('trailModule.submitRequiredActivity');

  const selectLesson = (id: string) => {
    setSearchParams({ aula: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        action={
          <Button className="min-h-11" nativeButton={false} render={<Link to={ROUTES.learn.trail(trail.slug)} />} variant="outline">
            <ArrowLeft aria-hidden="true" />
            {t('trailModule.back')}
          </Button>
        }
        breadcrumb={<Link className="hover:text-foreground" to={ROUTES.learn.trail(trail.slug)}>{trail.titulo}</Link>}
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

          <nav aria-label={t('lesson.listLabel')} className="overflow-x-auto">
            <ol className="flex min-w-max gap-2">
              {lessons.map((item) => {
                const done = progress.aulas[item.id]?.concluida;
                const active = item.id === lesson?.id;
                return (
                  <li key={item.id}>
                    <button
                      aria-current={active ? 'step' : undefined}
                      className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm transition-colors ${
                        active ? 'border-primary bg-primary/10 font-medium' : 'border-border hover:bg-surface-1'
                      }`}
                      onClick={() => selectLesson(item.id)}
                      type="button"
                    >
                      {done ? <CheckCircle2 aria-hidden="true" className="size-4 text-success" /> : <span className="text-xs text-muted-foreground">{item.ordem}</span>}
                      <span className="max-w-48 truncate">{item.titulo}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {lesson && (
            <LessonView
              blockProgress={progress.blocos}
              isMarkingRead={markRead.isPending}
              isSubmittingCheckpoint={checkpoint.isPending}
              key={lesson.id}
              lesson={lesson}
              onMarkRead={() => markRead.mutateAsync(lesson.id)}
              onSubmitCheckpoint={(answers) => checkpoint.mutateAsync({ lessonId: lesson.id, answers })}
              onVideoPosition={onVideoPosition}
              progress={progress.aulas[lesson.id]}
            />
          )}

          {nextLesson && progress.aulas[lesson?.id ?? '']?.concluida && (
            <Button className="min-h-11" onClick={() => selectLesson(nextLesson.id)}>
              {t('lesson.next')}
              <ArrowRight aria-hidden="true" />
            </Button>
          )}

          <QuizCard lessonsDone={lessonsDone} module={module} progress={progress} trail={trail} />

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
        </main>
        <ModuleSidebar activeModuleId={module.id} progress={progress} trail={trail} />
      </div>
      <ModuleFooter
        disabled={!moduleCompleted}
        onPrevious={previousModule ? () => navigate(ROUTES.learn.trailModule(trail.slug, previousModule.id)) : undefined}
        onPrimary={() =>
          nextModule
            ? navigate(ROUTES.learn.trailModule(trail.slug, nextModule.id))
            : navigate(ROUTES.learn.trailComplete(trail.slug))
        }
        primaryLabel={nextModule ? t('module.next') : t('trailModule.viewCompletion')}
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

  if (trailQuery.isLoading || progress.isLoading) return <p aria-live="polite">{t('trailModule.loadingTrail')}</p>;
  if (trailQuery.isError || progress.isError || !trailQuery.data || !progress.data) {
    return <EmptyState description={t('trailModule.notFoundTrailDescription')} icon={BookOpenCheck} title={t('trailModule.notFoundTrailTitle')} />;
  }
  if (progress.data.estado === 'nao_iniciado') return <StartTrailCard trail={trailQuery.data} />;
  return <TrailModuleContent moduleId={moduleId} progress={progress.data} trail={trailQuery.data} />;
}
