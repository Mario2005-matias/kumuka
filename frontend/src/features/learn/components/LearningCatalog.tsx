import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ROUTES } from '@/lib/constants/routes';
import type { LearningProgress, ProgressResourceType } from '@/types/progress';
import type { Course } from '@/types/course';
import type { Guide } from '@/types/guide';
import type { QuickLearning } from '@/types/quick-learning';
import type { Trail } from '@/types/trail';
import { useTranslation } from 'react-i18next';

type LearningItem = Trail | Course | QuickLearning | Guide;
type Category = 'trilhas' | 'cursos' | 'aprendizados' | 'guias';

interface LearningCatalogProps {
  category: Category;
  items: LearningItem[] | undefined;
  progress?: LearningProgress[];
  isLoading: boolean;
  isError: boolean;
}

const resourceType: Record<Category, ProgressResourceType | null> = {
  trilhas: 'trail',
  cursos: 'course',
  aprendizados: 'quick-learning',
  guias: null,
};

function detailPath(category: Category, slug: string): string {
  switch (category) {
    case 'trilhas':
      return ROUTES.learn.trail(slug);
    case 'cursos':
      return ROUTES.learn.course(slug);
    case 'aprendizados':
      return ROUTES.learn.quickLearning(slug);
    case 'guias':
      return ROUTES.learn.guide(slug);
  }
}

function durationLabel(item: LearningItem, t: ReturnType<typeof useTranslation<'learning'>>['t']): string | null {
  if (!('duracao' in item)) return null;
  return 'modulos' in item ? t('courseDetails.hours', { count: item.duracao }) : t('catalog.duration', { count: item.duracao });
}

function statusFor(
  category: Category,
  item: LearningItem,
  progress: LearningProgress[],
): { key: 'common.completed' | 'common.inProgress' | 'common.available'; status: 'success' | 'info' | 'neutral' } {
  const type = resourceType[category];
  const record = type
    ? progress.find((entry) => entry.recursoTipo === type && entry.recursoId === item.id)
    : undefined;
  if (record?.estado === 'concluido') return { key: 'common.completed', status: 'success' };
  if (record?.estado === 'em_progresso') return { key: 'common.inProgress', status: 'info' };
  return { key: 'common.available', status: 'neutral' };
}

export function LearningCatalog({
  category,
  items,
  progress = [],
  isLoading,
  isError,
}: LearningCatalogProps) {
  const { t } = useTranslation('learning');
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!items?.length) {
    return (
      <EmptyState
        description={t('catalog.emptyDescription')}
        icon={BookOpen}
        title={t('catalog.emptyTitle')}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const state = statusFor(category, item, progress);
        const duration = durationLabel(item, t);
        return (
          <Card className="flex flex-col border-border transition-colors hover:border-primary/50" key={item.id}>
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge status={state.status}>{t(state.key)}</StatusBadge>
                {'nivel' in item && (
                  <span className="text-xs capitalize text-muted-foreground">{item.nivel}</span>
                )}
              </div>
              <CardTitle className="text-lg">{item.titulo}</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">{item.descricao}</p>
            </CardHeader>
            <CardContent className="mt-auto space-y-4">
              {duration && (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 aria-hidden="true" className="size-4" />
                  {duration}
                </p>
              )}
              <Button
                className="w-full"
                nativeButton={false}
                render={<Link to={detailPath(category, item.slug)} />}
                variant="outline"
              >
                {t('catalog.details')}
                <ArrowRight aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
