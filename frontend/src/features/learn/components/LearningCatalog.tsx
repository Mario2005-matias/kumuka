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

function durationLabel(item: LearningItem): string | null {
  if (!('duracao' in item)) return null;
  return `${item.duracao} ${'modulos' in item ? 'h' : 'min'}`;
}

function statusFor(
  category: Category,
  item: LearningItem,
  progress: LearningProgress[],
): { label: string; status: 'success' | 'info' | 'neutral' } {
  const type = resourceType[category];
  const record = type
    ? progress.find((entry) => entry.recursoTipo === type && entry.recursoId === item.id)
    : undefined;
  if (record?.estado === 'concluido') return { label: 'Concluído', status: 'success' };
  if (record?.estado === 'em_progresso') return { label: 'Em progresso', status: 'info' };
  return { label: 'Disponível', status: 'neutral' };
}

export function LearningCatalog({
  category,
  items,
  progress = [],
  isLoading,
  isError,
}: LearningCatalogProps) {
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!items?.length) {
    return (
      <EmptyState
        description="Não há conteúdos disponíveis nesta área."
        icon={BookOpen}
        title="Ainda não há conteúdos para mostrar"
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const state = statusFor(category, item, progress);
        const duration = durationLabel(item);
        return (
          <Card className="flex flex-col border-border transition-colors hover:border-primary/50" key={item.id}>
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <StatusBadge status={state.status}>{state.label}</StatusBadge>
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
                Ver conteúdo
                <ArrowRight aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
