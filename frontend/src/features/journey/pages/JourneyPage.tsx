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
import { MediaCard } from '@/components/shared/MediaCard';
import { ProgressBar } from '@/features/learn/components/ProgressBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ROUTES } from '@/lib/constants/routes';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { useEnrollments } from '@/features/learn/hooks/useTrailFlow';
import { useProjects } from '@/features/profile/hooks/useProfile';
import { useAuthStore } from '@/stores/authStore';
import { useAchievements } from '@/features/dashboard/hooks/useAchievements';
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
  const progress = useEnrollments(Boolean(userId));
  const projects = useProjects(userId);
  const achievements = useAchievements(userId);
  const experiences = useExperiences({ pageSize: 50 });
  const records = progress.data ?? [];
  const averageProgress = records.length
    ? Math.round(records.reduce((total, item) => total + item.percentual, 0) / records.length)
    : 0;
  const activities = records.flatMap((record) =>
    record.trilha
      ? [{
          id: record.id,
          slug: record.trilha.slug,
          title: record.trilha.titulo,
          image: record.trilha.imagem,
          category: record.trilha.categoria,
          type: 'trail' as const,
          to: ROUTES.learn.trail(record.trilha.slug),
          percent: record.percentual,
          status: record.estado,
        }]
      : [],
  );
  const enrolledExperiences = experiences.data?.data.filter((item) => item.estado === 'inscrita') ?? [];
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
    progress.isLoading || projects.isLoading || achievements.isLoading ||
    experiences.isLoading;
  const hasError =
    progress.isError || projects.isError || achievements.isError ||
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
          <Card className="elevated overflow-hidden rounded-[1.75rem] border-border/70 bg-[image:var(--gradient-surface)]">
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
            <ol className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {milestones.map(({ key, icon }, index) => (
                <li key={key}>
                  <MediaCard
                    aside={
                      <StatusBadge status={isLoading ? 'neutral' : milestoneStatus[index].tone}>
                        {isLoading ? t('milestones.loading') : milestoneStatus[index].label}
                      </StatusBadge>
                    }
                    badge={String(index + 1).padStart(2, '0')}
                    description={t(`steps.${key}.description`)}
                    descriptionLines={0}
                    headingLevel="h3"
                    icon={icon}
                    title={t(`steps.${key}.title`)}
                    visual="banner"
                  />
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
              <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {activities.map((item) => (
                  <li key={item.id}>
                    <MediaCard
                      aside={
                        <StatusBadge status={item.status === 'concluido' ? 'success' : 'info'}>
                          {item.status === 'concluido' ? t('activityStatus.completed') : t('activityStatus.inProgress')}
                        </StatusBadge>
                      }
                      badge={t('activityProgress', { percent: item.percent })}
                      category={item.category}
                      headingLevel="h3"
                      image={item.image}
                      title={item.title}
                      to={item.to}
                    >
                      <ProgressBar label={t('activityProgress', { percent: item.percent })} value={item.percent} />
                    </MediaCard>
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
            <section aria-labelledby="journey-experiences-title" className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight" id="journey-experiences-title">
                {t('enrolledTitle')}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {enrolledExperiences.map((experience) => (
                  <MediaCard
                    description={experience.subtitulo}
                    headingLevel="h3"
                    image={experience.banner}
                    key={experience.id}
                    title={experience.titulo}
                    to={ROUTES.experiences.detail(experience.slug)}
                  >
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin aria-hidden="true" className="size-3.5 text-primary" />
                      {experience.dataInicio} · {experience.local}
                    </p>
                  </MediaCard>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
