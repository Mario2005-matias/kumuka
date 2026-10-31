import { ArrowRight, BookOpen, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingState } from '@/components/shared/LoadingState';
import { ROUTES } from '@/lib/constants/routes';
import type { Guide } from '@/types/guide';
import type { QuickLearning } from '@/types/quick-learning';
import { useTranslation } from 'react-i18next';

type LearningItem = QuickLearning | Guide;
export type ResourceCategory = 'aprendizados' | 'guias';

interface LearningCatalogProps {
  category: ResourceCategory;
  items: LearningItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

function detailPath(category: ResourceCategory, slug: string): string {
  return category === 'aprendizados'
    ? ROUTES.learn.quickLearning(slug)
    : ROUTES.learn.guide(slug);
}

export function LearningCatalog({ category, items, isLoading, isError }: LearningCatalogProps) {
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
      {items.map((item) => (
        <Card className="flex flex-col border-border transition-colors hover:border-primary/50" key={item.id}>
          <CardHeader className="gap-3">
            <span className="text-xs font-medium text-muted-foreground">{item.categoria}</span>
            <CardTitle className="text-lg">{item.titulo}</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">{item.descricao}</p>
          </CardHeader>
          <CardContent className="mt-auto space-y-4">
            {'duracao' in item && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 aria-hidden="true" className="size-4" />
                {t('catalog.duration', { count: item.duracao })}
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
      ))}
    </div>
  );
}
