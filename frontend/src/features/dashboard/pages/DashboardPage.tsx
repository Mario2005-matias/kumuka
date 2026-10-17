import {
  Award,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  FolderOpen,
  Map,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ROUTES } from '@/lib/constants/routes';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { useCourses } from '@/features/learn/hooks/useCourses';
import { useTrails } from '@/features/learn/hooks/useTrails';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuthStore } from '@/stores/authStore';
import { useAchievements } from '../hooks/useAchievements';
import { useProgress } from '../hooks/useProgress';
import { useRecommendations } from '../hooks/useRecommendations';
import { useTranslation } from 'react-i18next';

const exploreCards = [
  {
    key: 'learn',
    icon: BookOpen,
    to: ROUTES.learn.root,
  },
  {
    key: 'journey',
    icon: Map,
    to: ROUTES.journey,
  },
  {
    key: 'experiences',
    icon: Compass,
    to: ROUTES.experiences.root,
  },
] as const;

export default function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? '';
  const progress = useProgress(userId);
  const trails = useTrails();
  const courses = useCourses();
  const experiences = useExperiences();
  const achievements = useAchievements(userId);
  const profile = useProfile(userId);
  const recommendations = useRecommendations(userId);
  const records = progress.data ?? [];
  const trailCount = records.filter((item) => item.recursoTipo === 'trail').length;
  const experienceCount = (experiences.data ?? []).length;
  const unlockedCount = (achievements.data ?? []).filter((item) => item.unlocked).length;
  const averageProgress = records.length
    ? Math.round(records.reduce((total, item) => total + item.percentual, 0) / records.length)
    : 0;
  const continuing = records
    .filter((item) => item.estado === 'em_progresso')
    .map((record) => {
      const item =
        record.recursoTipo === 'trail'
          ? trails.data?.find((entry) => entry.id === record.recursoId)
          : record.recursoTipo === 'course'
            ? courses.data?.find((entry) => entry.id === record.recursoId)
            : undefined;
      if (!item) return null;
      const href =
        record.recursoTipo === 'trail'
          ? ROUTES.learn.trail(item.slug)
          : ROUTES.learn.course(item.slug);
      return { id: record.id, title: item.titulo, percent: record.percentual, href };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
  const nextExperiences = experiences.data?.slice(0, 2) ?? [];
  const recentAchievements = achievements.data?.filter((item) => item.unlocked).slice(0, 3) ?? [];
  const isLoading =
    progress.isLoading || trails.isLoading || courses.isLoading ||
    experiences.isLoading || achievements.isLoading || profile.isLoading ||
    recommendations.isLoading;
  const hasError =
    progress.isError || trails.isError || courses.isError ||
    experiences.isError || achievements.isError || profile.isError ||
    recommendations.isError;

  if (hasError) {
    return (
      <div className="space-y-8">
        <PageHeader
          description={t('description')}
          title={t('title')}
        />
        <ErrorState
          message={t('error')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description={t('description')}
        title={
          profile.data?.nome
            ? t('greeting', { name: profile.data.nome.split(' ')[0] })
            : t('title')
        }
      />

      {isLoading ? (
        <p aria-live="polite" className="text-sm text-muted-foreground">{t('loadingSummary')}</p>
      ) : (
        <section aria-label={t('summary')} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            description={t('averageDescription')}
            icon={Target}
            label={t('progress')}
            value={`${averageProgress}%`}
          />
          <StatCard
            description={t('trailsCount', { count: trailCount })}
            icon={BookOpen}
            label={t('trails')}
            value={trailCount}
          />
          <StatCard
            description={t('catalogue')}
            icon={BriefcaseBusiness}
            label={t('experiences')}
            value={experienceCount}
          />
          <StatCard
            description={t('unlocked')}
            icon={Award}
            label={t('achievements')}
            value={unlockedCount}
          />
        </section>
      )}

      <SectionCard
        description={t('continueDescription')}
        title={t('continueTitle')}
      >
        {progress.isLoading || trails.isLoading || courses.isLoading ? (
          <p aria-live="polite" className="text-sm text-muted-foreground">{t('loadingActivities')}</p>
        ) : continuing.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {continuing.map((item) => (
              <Card className="border-border" key={item.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t('completed', { percent: item.percent })}</p>
                  <div
                    aria-label={t('completed', { percent: item.percent })}
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={item.percent}
                    className="mt-3 h-2 overflow-hidden rounded-full bg-surface-3"
                    role="progressbar"
                  >
                    <div className="h-full rounded-full bg-primary" style={{ width: `${item.percent}%` }} />
                  </div>
                  <Button
                    className="mt-3 px-0 text-primary"
                    nativeButton={false}
                    render={<Link to={item.href} />}
                    variant="ghost"
                  >
                    {t('continue')}
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            className="border-0 bg-transparent py-5"
            description={t('noActivitiesDescription')}
            icon={FolderOpen}
            title={t('noActivitiesTitle')}
            action={
              <Button nativeButton={false} render={<Link to={ROUTES.learn.root} />}>
                {t('exploreContent')}
                <ArrowRight aria-hidden="true" />
              </Button>
            }
          />
        )}
      </SectionCard>

      <section aria-labelledby="recommendations-title" className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {t('discover')}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight" id="recommendations-title">
            {t('recommended')}
          </h2>
        </div>
        {recommendations.isLoading ? (
          <p aria-live="polite" className="text-sm text-muted-foreground">{t('loadingRecommendations')}</p>
        ) : recommendations.data?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {recommendations.data.map((recommendation) => {
              const item = recommendation.item;
              const to =
                recommendation.tipo === 'trail'
                  ? ROUTES.learn.trail(item.slug)
                  : recommendation.tipo === 'course'
                    ? ROUTES.learn.course(item.slug)
                    : recommendation.tipo === 'quick-learning'
                      ? ROUTES.learn.quickLearning(item.slug)
                      : ROUTES.learn.guide(item.slug);
              return (
                <Card className="border-border" key={`${recommendation.tipo}-${item.id}`}>
                  <CardContent className="flex h-full flex-col p-4">
                    <p className="text-xs font-medium capitalize text-primary">
                      {recommendation.tipo === 'quick-learning'
                        ? t('recommendationTypes.quickLearning')
                        : recommendation.tipo === 'trail'
                          ? t('recommendationTypes.trail')
                          : recommendation.tipo === 'course'
                            ? t('recommendationTypes.course')
                            : t('recommendationTypes.guide')}
                    </p>
                    <h3 className="mt-2 font-semibold">{item.titulo}</h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{item.descricao}</p>
                    <Button
                      className="mt-3 px-0 text-primary"
                      nativeButton={false}
                      render={<Link to={to} />}
                      variant="ghost"
                    >
                      {t('explore')}
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            className="border-0 bg-transparent py-5"
            description={t('noRecommendationsDescription')}
            icon={BookOpen}
            title={t('noRecommendationsTitle')}
          />
        )}
      </section>

      <section aria-labelledby="explore-title" className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {t('nextStep')}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight" id="explore-title">
            {t('exploreKumuka')}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {exploreCards.map(({ key, icon: Icon, to }) => (
            <Card className="group border-border transition-colors hover:border-primary/50" key={key}>
              <CardHeader>
                <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <CardTitle className="text-lg">{t(`exploreCards.${key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="min-h-12 text-sm leading-6 text-muted-foreground">{t(`exploreCards.${key}.description`)}</p>
                <Button
                  className="mt-4 px-0 text-primary"
                  nativeButton={false}
                  render={<Link to={to} />}
                  variant="ghost"
                >
                  {t(`exploreCards.${key}.action`)}
                  <ArrowRight aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          description={t('upcomingExperiencesDescription')}
          title={t('upcomingExperiences')}
          action={
            <Button
              nativeButton={false}
              render={<Link to={ROUTES.experiences.root} />}
              size="sm"
              variant="ghost"
            >
              {t('all')}
            </Button>
          }
        >
          {experiences.isLoading ? (
            <p aria-live="polite" className="text-sm text-muted-foreground">{t('loadingExperiences')}</p>
          ) : nextExperiences.length ? (
            <ul className="space-y-3">
              {nextExperiences.map((experience) => (
                <li key={experience.id}>
                  <Link
                    className="block rounded-lg border border-border p-4 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    to={ROUTES.experiences.detail(experience.slug)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold">{experience.titulo}</h3>
                      <StatusBadge status={experience.estado === 'inscrita' ? 'success' : experience.estado === 'futura' ? 'neutral' : experience.estado === 'sem-vagas' ? 'warning' : 'info'}>
                        {experience.estado === 'inscrita' ? t('experienceStatus.enrolled') : experience.estado === 'futura' ? t('experienceStatus.future') : experience.estado === 'sem-vagas' ? t('experienceStatus.noVacancies') : t('experienceStatus.available')}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{experience.data} · {experience.local}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              className="border-0 bg-transparent py-5"
              description={t('noExperiencesDescription')}
              icon={Compass}
              title={t('noExperiencesTitle')}
            />
          )}
        </SectionCard>
        <SectionCard
          description={t('recentAchievementsDescription')}
          title={t('recentAchievements')}
        >
          {achievements.isLoading ? (
            <p aria-live="polite" className="text-sm text-muted-foreground">{t('loadingAchievements')}</p>
          ) : recentAchievements.length ? (
            <ul className="space-y-3">
              {recentAchievements.map((achievement) => (
                <li className="flex items-start gap-3 rounded-lg border border-border p-4" key={achievement.id}>
                  <Award aria-hidden="true" className="mt-0.5 size-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{achievement.titulo}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{achievement.descricao}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              className="border-0 bg-transparent py-5"
              description={t('firstAchievementDescription')}
              icon={Award}
              title={t('firstAchievementTitle')}
            />
          )}
        </SectionCard>
      </div>
    </div>
  );
}
