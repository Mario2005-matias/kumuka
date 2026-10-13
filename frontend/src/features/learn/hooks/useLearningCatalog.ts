import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { Course } from '@/types/course';
import type { Guide } from '@/types/guide';
import type { QuickLearning } from '@/types/quick-learning';
import type { Trail } from '@/types/trail';
import type { CatalogParams } from './useTrails';

export type LearningCatalogCategory =
  | 'trails'
  | 'courses'
  | 'quick-learnings'
  | 'guides';
export type LearningCatalogItem = Trail | Course | QuickLearning | Guide;

const endpoints: Record<LearningCatalogCategory, string> = {
  trails: '/trails',
  courses: '/courses',
  'quick-learnings': '/quick-learnings',
  guides: '/guides',
};

export function useLearningCatalog(
  category: LearningCatalogCategory | null,
  params?: CatalogParams,
) {
  return useQuery({
    queryKey: ['learning-catalog', category, params],
    enabled: category !== null,
    queryFn: async (): Promise<LearningCatalogItem[]> => {
      if (!category) throw new Error('É necessária uma categoria de aprendizagem.');

      if (env.useMocks && import.meta.env.DEV) {
        switch (category) {
          case 'trails': {
            const { trailsHandler } = await import('@/lib/mocks/handlers/trails.handler');
            return trailsHandler.list(params);
          }
          case 'courses': {
            const { coursesHandler } = await import('@/lib/mocks/handlers/courses.handler');
            return coursesHandler.list(params);
          }
          case 'quick-learnings': {
            const { quickLearningsHandler } = await import('@/lib/mocks/handlers/quickLearnings.handler');
            return quickLearningsHandler.list(params);
          }
          case 'guides': {
            const { guidesHandler } = await import('@/lib/mocks/handlers/guides.handler');
            return guidesHandler.list(params);
          }
        }
      }

      const { data } = await api.get<LearningCatalogItem[]>(endpoints[category], { params });
      return data;
    },
  });
}
