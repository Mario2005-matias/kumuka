import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Clock3,
  GraduationCap,
  Layers3,
  Target,
  Users,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { CourseModuleList } from '@/features/learn/components/CourseModuleList';
import { CoursePageSkeleton } from '@/features/learn/components/CoursePageSkeleton';
import { CourseProgressBar } from '@/features/learn/components/CourseProgressBar';
import { RelatedCourses } from '@/features/learn/components/RelatedCourses';
import { useCourseProgressList, useStartCourse } from '@/features/learn/hooks/useCourseFlow';
import { useCourses, useCourse } from '@/features/learn/hooks/useCourses';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import type { Course, CourseLevel } from '@/types/course';
import { useTranslation } from 'react-i18next';

const levelTranslationKeys: Record<CourseLevel, 'courseFilters.beginner' | 'courseFilters.intermediate' | 'courseFilters.advanced'> = {
  iniciante: 'courseFilters.beginner',
  intermedio: 'courseFilters.intermediate',
  avancado: 'courseFilters.advanced',
};

function CourseDetails({ course }: { course: Course }) {
  const { t } = useTranslation('learning');
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const progressList = useCourseProgressList(userId);
  const start = useStartCourse(userId, course);
  const allCourses = useCourses();
  const [actionError, setActionError] = useState<string | null>(null);
  const progress = progressList.data?.find((item) => item.courseId === course.id);
  const currentModule =
    course.modulos.find((module) => module.id === progress?.moduloAtualId) ??
    course.modulos[0];
  const completed = progress?.estado === 'concluido';
  const inProgress = progress?.estado === 'em_progresso';

  async function beginOrResume() {
    if (!currentModule) return;
    setActionError(null);
    try {
      if (!progress || progress.estado === 'nao_iniciado') {
        await start.mutateAsync();
      }
      navigate(ROUTES.learn.courseModule(course.slug, currentModule.id));
    } catch (error: unknown) {
      setActionError(
        error instanceof Error ? error.message : t('courseDetails.startError'),
      );
    }
  }

  const buttonLabel = completed
    ? t('courseDetails.review')
    : inProgress
      ? t('courseDetails.continue')
      : t('courseDetails.start');

  if (progressList.isError) {
    return (
      <ErrorState
        message={t('courseDetails.progressError')}
        onRetry={() => void progressList.refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        action={
          <Button
            className="min-h-11"
            nativeButton={false}
            render={<Link to={ROUTES.learn.courses} />}
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" />
            {t('courseDetails.allCourses')}
          </Button>
        }
        breadcrumb={
          <div className="flex flex-wrap items-center gap-1">
            <Link className="hover:text-foreground" to={ROUTES.learn.root}>{t('hub.title')}</Link>
            <span aria-hidden="true">/</span>
            <Link className="hover:text-foreground" to={ROUTES.learn.courses}>{t('courseDetails.courses')}</Link>
            <span aria-hidden="true">/</span>
            <span>{course.titulo}</span>
          </div>
        }
        description={course.descricaoLonga}
        title={course.titulo}
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <StatusBadge className="bg-surface-2 text-foreground" status="info">{t('common.course')}</StatusBadge>
            <StatusBadge status="neutral">{t(levelTranslationKeys[course.nivel])}</StatusBadge>
            <StatusBadge status={course.acesso === 'free' ? 'success' : 'warning'}>
              {course.acesso === 'free' ? t('courseFilters.free') : t('courseFilters.premium')}
            </StatusBadge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-card p-3">
              <Clock3 aria-hidden="true" className="size-5 text-primary" />
              <span className="text-sm">{t('courseDetails.hours', { count: course.duracao })}</span>
            </div>
            <div className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-card p-3">
              <Layers3 aria-hidden="true" className="size-5 text-primary" />
              <span className="text-sm">{t('catalog.modules', { count: course.totalModulos })}</span>
            </div>
            <div className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-card p-3">
              <BarChart3 aria-hidden="true" className="size-5 text-primary" />
              <span className="text-sm">{t(levelTranslationKeys[course.nivel])}</span>
            </div>
            <div className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-card p-3">
              <Award aria-hidden="true" className="size-5 text-primary" />
              <span className="text-sm">{course.certifica ? t('completion.certificateAvailable') : t('completion.noCertificate')}</span>
            </div>
          </div>
          {progress && progress.estado !== 'nao_iniciado' && (
            <div className="space-y-2 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <span className="font-medium">{t('courseDetails.yourProgress')}</span>
                <span className="text-muted-foreground">
                  {progress.progresso}% · {t('courseDetails.modulesOf', { completed: progress.modulosConcluidos.length, total: course.totalModulos })}
                </span>
              </div>
              <CourseProgressBar courseTitle={course.titulo} value={progress.progresso} />
            </div>
          )}
        </div>
        <aside className="h-fit space-y-4 rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-semibold">{t('courseDetails.ready')}</p>
          <p className="text-sm leading-6 text-muted-foreground">
            {t('courseDetails.resumeDescription')}
          </p>
          {actionError && <p className="text-sm text-destructive" role="alert">{actionError}</p>}
          <Button
            className="min-h-11 w-full"
            disabled={progressList.isLoading || start.isPending || !currentModule}
            onClick={() => void beginOrResume()}
          >
            {start.isPending ? t('courseDetails.starting') : buttonLabel}
            <ArrowRight aria-hidden="true" />
          </Button>
          {inProgress && (
            <Button
              className="min-h-11 w-full"
              nativeButton={false}
              render={<a href="#course-program" />}
              variant="outline"
            >
              {t('courseDetails.viewModules')}
            </Button>
          )}
          {completed && (
            <Button
              className="min-h-11 w-full"
              nativeButton={false}
              render={<Link to={ROUTES.learn.courseComplete(course.slug)} />}
              variant="outline"
            >
              {t('courseDetails.viewCompletion')}
            </Button>
          )}
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Target aria-hidden="true" className="size-5 text-primary" />
            {t('courseDetails.learningOutcome')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.resultadoEsperado}</p>
          <p className="mt-3 text-sm font-semibold text-primary">{course.competenciaCentral}</p>
        </article>
        <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Users aria-hidden="true" className="size-5 text-primary" />
            {t('courseDetails.audience')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{course.publicoAlvo}</p>
        </article>
      </section>

      <section aria-labelledby="prerequisites-title" className="rounded-xl border border-border bg-surface-1 p-5">
        <h2 className="font-semibold" id="prerequisites-title">{t('courseDetails.prerequisites')}</h2>
        {course.preRequisitos.length ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {course.preRequisitos.map((item) => <li key={item}>{item}</li>)}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">{t('courseDetails.noPrerequisites')}</p>
        )}
      </section>

      <section aria-labelledby="course-program-title" className="space-y-4" id="course-program">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t('courseDetails.programme')}</p>
          <h2 className="mt-1 text-2xl font-bold" id="course-program-title">{t('courseDetails.modules')}</h2>
        </div>
        <CourseModuleList course={course} progress={progress} />
      </section>

      <section aria-labelledby="course-info-title" className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold" id="course-info-title">{t('courseDetails.information')}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-xs text-muted-foreground">{t('courseDetails.centralSkill')}</dt><dd className="mt-1 text-sm font-medium">{course.competenciaCentral}</dd></div>
          <div><dt className="text-xs text-muted-foreground">{t('courseFilters.level')}</dt><dd className="mt-1 text-sm font-medium">{t(levelTranslationKeys[course.nivel])}</dd></div>
          <div><dt className="text-xs text-muted-foreground">{t('courseFilters.duration')}</dt><dd className="mt-1 text-sm font-medium">{t('courseDetails.hours', { count: course.duracao })}</dd></div>
          <div><dt className="text-xs text-muted-foreground">{t('courseFilters.access')}</dt><dd className="mt-1 text-sm font-medium">{course.acesso === 'free' ? t('courseFilters.free') : t('courseFilters.premium')}</dd></div>
          {course.acesso === 'premium' && <div><dt className="text-xs text-muted-foreground">{t('courseDetails.price')}</dt><dd className="mt-1 text-sm font-medium">{course.preco?.toLocaleString('pt-AO')} Kz</dd></div>}
          <div><dt className="text-xs text-muted-foreground">{t('courseDetails.certification')}</dt><dd className="mt-1 text-sm font-medium">{course.certifica ? t('common.yes') : t('common.no')}</dd></div>
        </dl>
      </section>

      <RelatedCourses
        course={course}
        courses={allCourses.data ?? []}
        progressByCourse={new Map((progressList.data ?? []).map((item) => [item.courseId, item]))}
      />
    </div>
  );
}

export default function CourseDetailPage() {
  const { t } = useTranslation('learning');
  const { slug = '' } = useParams();
  const course = useCourse(slug);
  if (course.isLoading) return <CoursePageSkeleton />;
  if (course.isError) {
    return <ErrorState onRetry={() => void course.refetch()} />;
  }
  if (!course.data) {
    return (
      <EmptyState
        description={t('courseDetails.notFoundDescription')}
        icon={GraduationCap}
        title={t('courseDetails.notFoundTitle')}
      />
    );
  }
  return <CourseDetails course={course.data} />;
}
