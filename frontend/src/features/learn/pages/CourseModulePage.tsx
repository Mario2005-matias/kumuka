import { useState } from 'react';
import { ArrowLeft, BookOpenCheck, GraduationCap, LockKeyhole } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { ActivityForm } from '@/features/learn/components/ActivityForm';
import { ContentRenderer } from '@/features/learn/components/ContentRenderer';
import { ModuleFooter } from '@/features/learn/components/ModuleFooter';
import { CourseModuleSidebar } from '@/features/learn/components/CourseModuleSidebar';
import {
  isAccessibleCourseModule,
  useCompleteCourse,
  useCompleteCourseModule,
  useMarkCourseContentRead,
  useSaveCourseDraft,
  useStartCourse,
  useSubmitCourseActivity,
  useCourseProgress,
} from '@/features/learn/hooks/useCourseFlow';
import { useCourse, useCourseModule } from '@/features/learn/hooks/useCourses';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import type { Course } from '@/types/course';

function CourseModuleContent({
  course,
  slug,
  moduleId,
}: {
  course: Course;
  slug: string;
  moduleId: string;
}) {
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const moduleQuery = useCourseModule(slug, moduleId);
  const progress = useCourseProgress(userId, course.id);
  const start = useStartCourse(userId, course);
  const markRead = useMarkCourseContentRead(userId, course);
  const saveDraft = useSaveCourseDraft(userId, course);
  const submitActivity = useSubmitCourseActivity(userId, course);
  const completeModule = useCompleteCourseModule(userId, course);
  const completeCourse = useCompleteCourse(userId, course);
  const [showActivity, setShowActivity] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const module = moduleQuery.data;
  const previousModule = course.modulos.find(
    (item) => item.ordem === (module?.ordem ?? 0) - 1,
  );
  const accessible = module
    ? isAccessibleCourseModule(course, progress.data, module.id)
    : false;
  const readItems = module
    ? module.contentItems.filter((item) => progress.data?.conteudosLidos.includes(item.id))
    : [];
  const allRead = Boolean(module && readItems.length === module.contentItems.length);
  const nextUnread = module?.contentItems.find(
    (item) => !progress.data?.conteudosLidos.includes(item.id),
  );
  const activity = module?.activity;
  const submitted = Boolean(
    activity && progress.data?.atividadesSubmetidas.includes(activity.id),
  );
  const moduleComplete = Boolean(
    module && progress.data?.modulosConcluidos.includes(module.id),
  );
  const lastModule = module?.ordem === course.totalModulos;
  const canAdvance = allRead && (!activity?.obrigatoria || submitted);
  const footerLabel = moduleComplete
    ? lastModule
      ? 'Concluir curso'
      : 'Próximo módulo'
    : allRead
      ? 'Concluir módulo'
      : activity && nextUnread?.ordem === module?.contentItems.length
        ? 'Marcar como lido e ir para actividade'
        : 'Marcar como lido';

  async function beginCourse() {
    setActionError(null);
    try {
      await start.mutateAsync();
      await progress.refetch();
    } catch (error: unknown) {
      setActionError(
        error instanceof Error ? error.message : 'Não foi possível iniciar o curso.',
      );
    }
  }

  async function finishModule() {
    if (!module || !progress.data) return;
    setActionError(null);
    if (!moduleComplete && !allRead) {
      setActionError('Lê todos os conteúdos antes de concluir o módulo.');
      return;
    }
    if (!moduleComplete && activity?.obrigatoria && !submitted) {
      setActionError('Submete a actividade obrigatória antes de avançar.');
      return;
    }
    try {
      const updated = moduleComplete
        ? progress.data
        : await completeModule.mutateAsync({ moduleId: module.id });
      const nextModule = course.modulos.find(
        (item) => !updated.modulosConcluidos.includes(item.id),
      );
      if (updated.modulosConcluidos.length === course.totalModulos) {
        await completeCourse.mutateAsync();
        navigate(ROUTES.learn.courseComplete(course.slug));
      } else if (nextModule) {
        navigate(ROUTES.learn.courseModule(course.slug, nextModule.id));
      } else {
        setActionError('O módulo foi concluído, mas não foi possível determinar o próximo passo.');
      }
    } catch (error: unknown) {
      setActionError(error instanceof Error ? error.message : 'Não foi possível concluir o módulo.');
    }
  }

  async function advanceContent() {
    if (!module || !nextUnread) return;
    setActionError(null);
    try {
      await markRead.mutateAsync({ moduleId: module.id, contentId: nextUnread.id });
      if (nextUnread.ordem === module.contentItems.length) setShowActivity(true);
    } catch (error: unknown) {
      setActionError(error instanceof Error ? error.message : 'Não foi possível guardar a leitura.');
    }
  }

  if (moduleQuery.isLoading || progress.isLoading) {
    return (
      <div aria-label="A carregar módulo do curso" className="grid animate-pulse gap-5 lg:grid-cols-[1fr_16rem]">
        <div className="h-96 rounded-xl bg-surface-2" />
        <div className="h-72 rounded-xl bg-surface-2" />
      </div>
    );
  }
  if (moduleQuery.isError || progress.isError) {
    return (
      <ErrorState
        message="Não foi possível carregar o módulo ou o teu progresso."
        onRetry={() => {
          void moduleQuery.refetch();
          void progress.refetch();
        }}
      />
    );
  }
  if (!module) {
    return (
      <EmptyState
        description="Volta ao curso para escolher um módulo disponível."
        icon={GraduationCap}
        title="Módulo não encontrado"
      />
    );
  }
  if (!progress.data || progress.data.estado === 'nao_iniciado') {
    return (
      <div className="mx-auto max-w-xl space-y-5 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <GraduationCap aria-hidden="true" className="mx-auto size-9 text-primary" />
        <h1 className="text-2xl font-bold">Começa este curso</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Inicia o curso para guardar o teu progresso e desbloquear os módulos pela ordem.
        </p>
        {actionError && <p className="text-sm text-destructive" role="alert">{actionError}</p>}
        <Button className="min-h-11" disabled={start.isPending} onClick={() => void beginCourse()}>
          {start.isPending ? 'A iniciar…' : 'Começar curso'}
        </Button>
      </div>
    );
  }
  if (!accessible) {
    return (
      <div className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <LockKeyhole aria-hidden="true" className="mx-auto size-9 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Módulo bloqueado</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Conclui o módulo anterior para desbloquear este conteúdo.
        </p>
        <Button className="min-h-11" nativeButton={false} render={<Link to={ROUTES.learn.course(course.slug)} />} variant="outline">
          Ver módulos
        </Button>
      </div>
    );
  }

  const currentContent = allRead
    ? undefined
    : nextUnread ?? module.contentItems[0];
  const isActivityView = allRead && (showActivity || !moduleComplete);
  const footerProgress = allRead
    ? `Conteúdos lidos · ${module.contentItems.length} de ${module.contentItems.length}`
    : `Conteúdo ${readItems.length + 1} de ${module.contentItems.length}`;

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        action={
          <Button className="min-h-11" nativeButton={false} render={<Link to={ROUTES.learn.course(course.slug)} />} variant="outline">
            <ArrowLeft aria-hidden="true" />
            Voltar ao curso
          </Button>
        }
        breadcrumb={
          <div className="flex flex-wrap items-center gap-1">
            <Link className="hover:text-foreground" to={ROUTES.learn.course(course.slug)}>{course.titulo}</Link>
            <span aria-hidden="true">/</span>
            <span>Módulo {module.ordem} de {course.totalModulos}</span>
          </div>
        }
        description={module.descricao}
        title={module.titulo}
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <main className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Módulo {module.ordem} de {course.totalModulos}
            </p>
            {moduleComplete && <StatusBadge status="success">Módulo concluído</StatusBadge>}
          </div>
          {!isActivityView && currentContent && (
            <section aria-live="polite" className="space-y-3">
              <ContentRenderer item={currentContent} />
              <p className="text-sm text-muted-foreground">
                {readItems.length} de {module.contentItems.length} conteúdos concluídos
              </p>
            </section>
          )}
          {isActivityView && activity && (
            <ActivityForm
              activity={activity}
              draft={progress.data.rascunhosAtividade[activity.id]}
              isSaving={saveDraft.isPending}
              isSubmitting={submitActivity.isPending}
              key={activity.id}
              onMarkComplete={finishModule}
              onSaveDraft={async (answer) => {
                await saveDraft.mutateAsync({ moduleId: module.id, answer });
              }}
              onSubmit={async (answer) => {
                await submitActivity.mutateAsync({ moduleId: module.id, answer });
              }}
              submitted={submitted}
            />
          )}
          {moduleComplete && (
            <div className="rounded-xl border border-success/30 bg-success/5 p-5">
              <p className="flex items-center gap-2 font-semibold text-success">
                <BookOpenCheck aria-hidden="true" className="size-5" />
                Bom trabalho! Módulo concluído.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {lastModule ? 'Conclui o curso para guardar o teu certificado.' : 'O próximo módulo já está desbloqueado.'}
              </p>
            </div>
          )}
          {actionError && <p className="text-sm text-destructive" role="alert">{actionError}</p>}
        </main>
        <CourseModuleSidebar
          activeModuleId={module.id}
          course={course}
          progress={progress.data}
        />
      </div>
      <ModuleFooter
        disabled={!moduleComplete && isActivityView && !canAdvance || !moduleComplete && !isActivityView && !currentContent}
        isPending={markRead.isPending || completeModule.isPending || completeCourse.isPending}
        onPrevious={
          previousModule
            ? () => navigate(ROUTES.learn.courseModule(course.slug, previousModule.id))
            : undefined
        }
        onPrimary={() => {
          if (moduleComplete || (allRead && canAdvance)) {
            void finishModule();
          } else if (!allRead) {
            void advanceContent();
          }
        }}
        primaryLabel={moduleComplete || (allRead && canAdvance) ? (moduleComplete && lastModule ? 'Concluir curso' : moduleComplete ? 'Próximo módulo' : 'Concluir módulo') : footerLabel}
        progressLabel={footerProgress}
      />
    </div>
  );
}

export default function CourseModulePage() {
  const { slug = '', moduleId = '' } = useParams();
  const course = useCourse(slug);
  if (course.isLoading) return <p aria-live="polite">A carregar curso…</p>;
  if (course.isError) return <ErrorState onRetry={() => void course.refetch()} />;
  if (!course.data) {
    return (
      <EmptyState
        description="Volta ao catálogo para escolher um curso disponível."
        icon={GraduationCap}
        title="Curso não encontrado"
      />
    );
  }
  return <CourseModuleContent course={course.data} moduleId={moduleId} slug={slug} />;
}
