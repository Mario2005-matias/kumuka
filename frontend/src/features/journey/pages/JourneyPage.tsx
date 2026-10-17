import {
  ArrowRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  Hammer,
  MapPin,
  Target,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ROUTES } from '@/lib/constants/routes';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { useCourses } from '@/features/learn/hooks/useCourses';
import { useQuickLearnings } from '@/features/learn/hooks/useQuickLearnings';
import { useTrails } from '@/features/learn/hooks/useTrails';
import { useProjects } from '@/features/profile/hooks/useProfile';
import { useAuthStore } from '@/stores/authStore';
import { useAchievements } from '@/features/dashboard/hooks/useAchievements';
import { useProgress } from '@/features/dashboard/hooks/useProgress';
import { useTranslation } from 'react-i18next';

const milestones: { key: 'learn' | 'develop' | 'do' | 'prove' | 'experience' | 'advance'; icon: LucideIcon }[] = [
  { key: 'learn', icon: BookOpen },
  { key: 'develop', icon: TrendingUp },
  { key: 'do', icon: Hammer },
  { key: 'prove', icon: Award },
  { key: 'experience', icon: Compass },
  { key: 'advance', icon: BriefcaseBusiness },
];

export default function JourneyPage() {
  const { t } = useTranslation('journey');
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const progress = useProgress(userId);
  const trails = useTrails();
  const courses = useCourses();
  const quickLearnings = useQuickLearnings();
  const projects = useProjects(userId);
  const achievements = useAchievements(userId);
  const experiences = useExperiences();
  const records = progress.data ?? [];
  const averageProgress = records.length
    ? Math.round(records.reduce((total, item) => total + item.percentual, 0) / records.length)
    : 0;
  const learningItems = [
    ...(trails.data ?? []).map((item) => ({ id: item.id, slug: item.slug, title: item.titulo, type: 'trail' as const })),
    ...(courses.data ?? []).map((item) => ({ id: item.id, slug: item.slug, title: item.titulo, type: 'course' as const })),
    ...(quickLearnings.data ?? []).map((item) => ({ id: item.id, slug: item.slug, title: item.titulo, type: 'quick-learning' as const })),
  ];
  const activities = records.map((record) => {
    const item = learningItems.find((entry) => entry.id === record.recursoId);
    if (!item) return null;
    const to =
      item.type === 'trail'
        ? ROUTES.learn.trail(item.slug)
        : item.type === 'course'
          ? ROUTES.learn.course(item.slug)
          : ROUTES.learn.quickLearning(item.slug);
    return { ...item, to, percent: record.percentual, status: record.estado };
  }).filter((item): item is NonNullable<typeof item> => item !== null);
  const enrolledExperiences = experiences.data?.filter((item) => item.estado === 'inscrita') ?? [];
  const milestoneStatus = [
    records.some((item) => item.estado === 'concluido')
      ? { label: t('milestones.completed'), tone: 'success' as const }
      : records.length
        ? { label: t('milestones.inProgress'), tone: 'info' as const }
        : { label: t('milestones.notStarted'), tone: 'neutral' as const },
    records.some((item) => item.estado === 'em_progresso') ? { label: t('milestones.inProgress'), tone: 'info' as const } : { label: t('milestones.next'), tone: 'neutral' as const },
    projects.data?.length ? { label: t('milestones.projects', { count: projects.data.length }), tone: 'success' as const } : { label: t('milestones.next'), tone: 'neutral' as const },
    achievements.data?.some((item) => item.unlocked) ? { label: t('milestones.withEvidence'), tone: 'success' as const } : { label: t('milestones.next'), tone: 'neutral' as const },
    enrolledExperiences.length ? { label: t('milestones.enrolled'), tone: 'info' as const } : { label: t('milestones.next'), tone: 'neutral' as const },
    { label: t('milestones.next'), tone: 'neutral' as const },
  ];
  const isLoading =
    progress.isLoading || trails.isLoading || courses.isLoading ||
    quickLearnings.isLoading || projects.isLoading || achievements.isLoading ||
    experiences.isLoading;
  const hasError =
    progress.isError || trails.isError || courses.isError ||
    quickLearnings.isError || projects.isError || achievements.isError ||
    experiences.isError;

  return (
    <div className="space-y-8">
      <PageHeader
        description={t('description')}
        title={t('title')}
      />

      {hasError ? (
        <ErrorState message={t('error')} />
      ) : (
        <>
          <Card className="overflow-hidden bg-[image:var(--gradient-surface)]">
            <CardHeader>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{t('overview')}</p>
              <CardTitle className="text-xl">{t('overviewTitle')}</CardTitle>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {t('overviewDescription')}
              </p>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p aria-live="polite" className="text-sm text-muted-foreground">{t('loading')}</p>
              ) : (
                <>
                  <div
                    aria-label={t('averageProgress', { percent: averageProgress, count: records.length })}
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={averageProgress}
                    className="h-2 overflow-hidden rounded-full bg-surface-3"
                    role="progressbar"
                  >
                    <div className="h-full rounded-full bg-primary" style={{ width: `${averageProgress}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t('averageProgress', { percent: averageProgress, count: records.length })}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <section aria-labelledby="journey-steps-title">
            <h2 className="mb-5 text-xl font-semibold tracking-tight" id="journey-steps-title">
              {t('stepsTitle')}
            </h2>
            <ol className="relative space-y-4 before:absolute before:bottom-8 before:left-6 before:top-8 before:w-px before:bg-border">
              {milestones.map(({ key, icon: Icon }, index) => (
                <li className="relative" key={key}>
                  <Card className="relative ml-0 border-border bg-card sm:ml-2">
                    <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                      <span className="z-10 flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2 text-primary">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold tabular-nums text-subtle-foreground">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <h3 className="font-semibold">{t(`steps.${key}.title`)}</h3>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{t(`steps.${key}.description`)}</p>
                      </div>
                      <StatusBadge status={isLoading ? 'neutral' : milestoneStatus[index].tone}>
                        {isLoading ? t('milestones.loading') : milestoneStatus[index].label}
                      </StatusBadge>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="journey-activities-title" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight" id="journey-activities-title">
                {t('activitiesTitle')}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('activitiesDescription')}
              </p>
            </div>
            {isLoading ? (
              <p aria-live="polite" className="text-sm text-muted-foreground">{t('loadingActivities')}</p>
            ) : activities.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {activities.map((item) => (
                  <li key={item.id}>
                    <Link
                      className="block rounded-xl border border-border bg-card p-4 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      to={item.to}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold">{item.title}</h3>
                        <StatusBadge status={item.status === 'concluido' ? 'success' : 'info'}>
                          {item.status === 'concluido' ? t('activityStatus.completed') : t('activityStatus.inProgress')}
                        </StatusBadge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{t('activityProgress', { percent: item.percent })}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                description={t('emptyDescription')}
                icon={Target}
                title={t('emptyTitle')}
                action={
                  <Button nativeButton={false} render={<Link to={ROUTES.learn.root} />}>
                    {t('findLearning')}
                    <ArrowRight aria-hidden="true" />
                  </Button>
                }
              />
            )}
          </section>
          {enrolledExperiences.length > 0 && (
            <section aria-labelledby="journey-experiences-title" className="space-y-3">
              <h2 className="text-xl font-semibold tracking-tight" id="journey-experiences-title">
                {t('enrolledTitle')}
              </h2>
              {enrolledExperiences.map((experience) => (
                <Link
                  className="flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  key={experience.id}
                  to={ROUTES.experiences.detail(experience.slug)}
                >
                  <MapPin aria-hidden="true" className="size-5 text-primary" />
                  <span className="flex-1 font-medium">{experience.titulo}</span>
                  <span className="text-sm text-muted-foreground">{experience.data}</span>
                </Link>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
