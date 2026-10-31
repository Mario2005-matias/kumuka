import { ArrowRight, BookOpen, FileText, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { ROUTES } from '@/lib/constants/routes';
import { useEnrollments } from '../hooks/useTrailFlow';
import { useTranslation } from 'react-i18next';

const categories: {
  key: 'trails' | 'quickLearnings' | 'guides';
  icon: LucideIcon;
  to: string;
}[] = [
  { key: 'trails', icon: BookOpen, to: ROUTES.learn.trails },
  { key: 'quickLearnings', icon: Zap, to: ROUTES.learn.quickLearnings },
  { key: 'guides', icon: FileText, to: ROUTES.learn.guides },
];

const categoryTabs = [
  { key: 'all', to: ROUTES.learn.root },
  { key: 'trails', to: ROUTES.learn.trails },
  { key: 'quickLearnings', to: ROUTES.learn.quickLearnings },
  { key: 'guides', to: ROUTES.learn.guides },
] as const;

export default function LearnHubPage() {
  const { t } = useTranslation('learning');
  const progress = useEnrollments();
  const inProgress = (progress.data ?? [])
    .filter((record) => record.estado === 'em_progresso' && record.trilha)
    .map((record) => ({
      id: record.id,
      title: record.trilha?.titulo ?? '',
      to: record.moduloAtualId && record.trilha
        ? ROUTES.learn.trailModule(record.trilha.slug, record.moduloAtualId)
        : ROUTES.learn.trail(record.trilha?.slug ?? ''),
      percent: record.percentual,
    }));

  return (
    <div className="space-y-8">
      <PageHeader
        description={t('hub.description')}
        title={t('hub.title')}
      />

      <nav aria-label={t('hub.categoriesLabel')} className="overflow-x-auto">
        <ul className="flex min-w-max gap-2 border-b border-border">
          {categoryTabs.map(({ key, to }, index) => (
            <li key={to}>
              <Link
                aria-current={index === 0 ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  index === 0
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                to={to}
              >
                {t(`hub.tabs.${key}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <SectionCard
        className="overflow-hidden bg-[image:var(--gradient-surface)]"
        contentClassName="pb-6"
        description={t('hub.purposeDescription')}
        title={t('hub.purposeTitle')}
      >
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {t('hub.purposeBody')}
        </p>
      </SectionCard>

      <section aria-labelledby="learning-formats-title" className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {t('hub.formatsEyebrow')}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight" id="learning-formats-title">
            {t('hub.exploreTitle')}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map(({ key, icon: Icon, to }) => (
            <Card
              className="group border-border transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-surface-1"
              key={key}
            >
              <CardHeader>
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <CardTitle className="text-lg">
                  {t(`hub.categories.${key}.title`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="min-h-12 text-sm leading-6 text-muted-foreground">
                  {t(`hub.categories.${key}.description`)}
                </p>
                <Button
                  className="mt-4 px-0 text-primary"
                  nativeButton={false}
                  render={<Link to={to} />}
                  variant="ghost"
                >
                  {t('hub.explore')}
                  <ArrowRight aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <SectionCard
        description={t('hub.continueDescription')}
        title={t('hub.continueTitle')}
      >
        {progress.isLoading ? (
          <p aria-live="polite" className="text-sm text-muted-foreground">{t('hub.loadingProgress')}</p>
        ) : progress.isError ? (
          <p className="text-sm text-destructive" role="alert">{t('hub.progressError')}</p>
        ) : inProgress.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {inProgress.map((item) => (
              <Card className="border-border" key={item.id}>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t('hub.completed', { percent: item.percent })}</p>
                  <div
                    aria-label={t('hub.completed', { percent: item.percent })}
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
                    render={<Link to={item.to} />}
                    variant="ghost"
                  >
                    {t('hub.continueAction')}
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            className="border-0 bg-transparent py-5"
            description={t('hub.emptyDescription')}
            icon={BookOpen}
            title={t('hub.emptyTitle')}
          />
        )}
      </SectionCard>
    </div>
  );
}
