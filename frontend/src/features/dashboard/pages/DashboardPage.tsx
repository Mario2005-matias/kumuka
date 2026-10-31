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
import { MediaCard, MediaCardAction } from '@/components/shared/MediaCard';
import { ProgressBar } from '@/features/learn/components/ProgressBar';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ROUTES } from '@/lib/constants/routes';
import { useExperiences } from '@/features/experiences/hooks/useExperiences';
import { useEnrollments } from '@/features/learn/hooks/useTrailFlow';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuthStore } from '@/stores/authStore';
import { useAchievements } from '../hooks/useAchievements';
import { useRecommendations } from '../hooks/useRecommendations';
import { useTranslation } from 'react-i18next';
import Painel from "../../../assets/painel.png"

const exploreCards = [
  {
    key: 'learn',
    icon: BookOpen,
    to: ROUTES.learn.root
  },
  {
    key: 'journey',
    icon: Map,
    to: ROUTES.journey
  },
  {
    key: 'experiences',
    icon: Compass,
    to: ROUTES.experiences.root
  },
] as const;

export default function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? '';
  const progress = useEnrollments(Boolean(userId));
  const experiences = useExperiences({ pageSize: 2 });
  const achievements = useAchievements(userId);
  const profile = useProfile(userId);
  const recommendations = useRecommendations(userId);
  const records = progress.data ?? [];
  const trailCount = records.length;
  const experienceCount = experiences.data?.meta.total ?? 0;
  const unlockedCount = (achievements.data ?? []).filter((item) => item.unlocked).length;
  const averageProgress = records.length
    ? Math.round(records.reduce((total, item) => total + item.percentual, 0) / records.length)
    : 0;
  const continuing = records
    .filter((record) => record.estado === 'em_progresso' && record.trilha)
    .map((record) => ({
      id: record.id,
      title: record.trilha?.titulo ?? '',
      image: record.trilha?.imagem ?? null,
      category: record.trilha?.categoria ?? '',
      percent: record.percentual,
      href: record.moduloAtualId && record.trilha
        ? ROUTES.learn.trailModule(record.trilha.slug, record.moduloAtualId)
        : ROUTES.learn.trail(record.trilha?.slug ?? ''),
    }));
  const nextExperiences = experiences.data?.data ?? [];
  const recentAchievements = achievements.data?.filter((item) => item.unlocked).slice(0, 3) ?? [];
  const isLoading =
    progress.isLoading ||
    experiences.isLoading || achievements.isLoading || profile.isLoading ||
    recommendations.isLoading;
  const hasError =
    progress.isError ||
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
        {progress.isLoading ? (
          <p aria-live="polite" className="text-sm text-muted-foreground">{t('loadingActivities')}</p>
        ) : continuing.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {continuing.map((item) => (
              <MediaCard
                badge={t('completed', { percent: item.percent })}
                category={item.category || undefined}
                headingLevel="h3"
                image={item.image}
                key={item.id}
                title={item.title}
                to={item.href}
              >
                <ProgressBar label={t('completed', { percent: item.percent })} value={item.percent} />
                <MediaCardAction>{t('continue')}</MediaCardAction>
              </MediaCard>
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
                  : recommendation.tipo === 'quick-learning'
                    ? ROUTES.learn.quickLearning(item.slug)
                    : ROUTES.learn.guide(item.slug);
              return (
                <MediaCard
                  category={
                    recommendation.tipo === 'quick-learning'
                      ? t('recommendationTypes.quickLearning')
                      : recommendation.tipo === 'trail'
                        ? t('recommendationTypes.trail')
                        : t('recommendationTypes.guide')
                  }
                  description={item.descricao}
                  headingLevel="h3"
                  image={recommendation.tipo === 'trail' ? recommendation.item.imagem ?? Painel : Painel}
                  key={`${recommendation.tipo}-${item.id}`}
                  title={item.titulo}
                  to={to}
                >
                  <MediaCardAction>{t('explore')}</MediaCardAction>
                </MediaCard>
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
          {exploreCards.map(({ key, icon, to }) => (
            <MediaCard
              description={t(`exploreCards.${key}.description`)}
              headingLevel="h3"
              icon={icon}
              key={key}
              title={t(`exploreCards.${key}.title`)}
              to={to}
              visual="banner"
            >
              <MediaCardAction>{t(`exploreCards.${key}.action`)}</MediaCardAction>
            </MediaCard>
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
                    className="block rounded-2xl border border-border bg-surface-1 p-4 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    to={ROUTES.experiences.detail(experience.slug)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold">{experience.titulo}</h3>
                      <StatusBadge status={experience.estado === 'inscrita' ? 'success' : experience.estado === 'futura' ? 'neutral' : experience.estado === 'sem-vagas' ? 'warning' : 'info'}>
                        {experience.estado === 'inscrita' ? t('experienceStatus.enrolled') : experience.estado === 'futura' ? t('experienceStatus.future') : experience.estado === 'sem-vagas' ? t('experienceStatus.noVacancies') : t('experienceStatus.available')}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{experience.dataInicio} · {experience.local}</p>
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
                <li className="flex items-start gap-3 rounded-2xl border border-border bg-surface-1 p-4" key={achievement.id}>
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
