import { ArrowLeft, Award, BadgeCheck, LayoutDashboard, PartyPopper, UserRound } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { CourseCompletionCard } from '@/features/learn/components/CourseCompletionCard';
import { CoursePageSkeleton } from '@/features/learn/components/CoursePageSkeleton';
import { RelatedCourses } from '@/features/learn/components/RelatedCourses';
import { useCourseProgress, useCourseProgressList } from '@/features/learn/hooks/useCourseFlow';
import { useCourse, useCourses } from '@/features/learn/hooks/useCourses';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';

export default function CourseCompletePage() {
  const { t } = useTranslation('learning');
  const { slug = '' } = useParams();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const course = useCourse(slug);
  const progress = useCourseProgress(userId, course.data?.id ?? '');
  const allProgress = useCourseProgressList(userId);
  const courses = useCourses();

  if (course.isLoading) return <CoursePageSkeleton />;
  if (course.isError) return <ErrorState onRetry={() => void course.refetch()} />;
  if (!course.data) {
    return (
      <EmptyState
        description={t('courseCompletion.notFoundDescription')}
        icon={Award}
        title={t('courseCompletion.notFoundTitle')}
      />
    );
  }
  if (progress.isLoading) return <p aria-live="polite">{t('courseCompletion.loading')}</p>;
  if (progress.isError) return <ErrorState onRetry={() => void progress.refetch()} />;
  if (!progress.data || progress.data.estado !== 'concluido') {
    return <Navigate replace to={ROUTES.learn.course(course.data.slug)} />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div aria-hidden="true" className="pointer-events-none relative flex h-16 justify-center gap-5">
        <span className="absolute left-[30%] top-2 size-2 rotate-12 animate-bounce rounded-sm bg-primary motion-reduce:animate-none" />
        <span className="absolute left-[38%] top-8 size-2 -rotate-12 animate-bounce rounded-full bg-success motion-reduce:animate-none [animation-delay:100ms]" />
        <span className="absolute left-[45%] top-0 size-3 rotate-45 animate-bounce rounded-sm bg-info motion-reduce:animate-none [animation-delay:200ms]" />
        <PartyPopper className="size-6 self-center text-primary" />
        <Award className="size-9 self-center text-success" />
        <PartyPopper className="size-6 self-center text-primary" />
        <span className="absolute right-[38%] top-8 size-2 rotate-12 animate-bounce rounded-sm bg-warning motion-reduce:animate-none [animation-delay:150ms]" />
        <span className="absolute right-[30%] top-1 size-2 -rotate-12 animate-bounce rounded-full bg-primary motion-reduce:animate-none [animation-delay:250ms]" />
      </div>
      <PageHeader
        description={t('courseCompletion.description', { skill: course.data.competenciaCentral })}
        title={t('courseCompletion.title')}
      />
      <CourseCompletionCard course={course.data} progress={progress.data} />
      <section className="rounded-xl border border-success/30 bg-success/5 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <BadgeCheck aria-hidden="true" className="size-5 text-success" />
          {t('courseCompletion.whatYouEarned')}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {t('courseCompletion.achievementDescription')}
        </p>
      </section>
      <section aria-label={t('courseCompletion.nextActions')} className="grid gap-3 sm:grid-cols-3">
        <Button className="min-h-11 w-full" nativeButton={false} render={<Link to={ROUTES.profile} />}>
          <UserRound aria-hidden="true" />
          {t('courseCompletion.viewPortfolio')}
        </Button>
        <Button className="min-h-11 w-full" nativeButton={false} render={<Link to={ROUTES.learn.courses} />} variant="outline">
          <ArrowLeft aria-hidden="true" />
          {t('courseCompletion.moreCourses')}
        </Button>
        <Button className="min-h-11 w-full" nativeButton={false} render={<Link to={ROUTES.dashboard} />} variant="outline">
          <LayoutDashboard aria-hidden="true" />
          {t('courseCompletion.dashboard')}
        </Button>
      </section>
      <RelatedCourses
        course={course.data}
        courses={courses.data ?? []}
        progressByCourse={new Map((allProgress.data ?? []).map((item) => [item.courseId, item]))}
      />
    </div>
  );
}
