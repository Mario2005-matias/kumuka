import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPage } from '@/lib/api/client';
import type { Guide } from '@/types/guide';
import type { QuickLearning } from '@/types/quick-learning';
import type { Trail } from '@/types/trail';
import type { CatalogParams } from './useTrails';

export type LearningCatalogCategory = 'trails' | 'quick-learnings' | 'guides';
export type LearningCatalogItem = Trail | QuickLearning | Guide;

const endpoints: Record<LearningCatalogCategory, string> = {
  trails: '/trails',
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
    placeholderData: keepPreviousData,
    queryFn: () => getPage<LearningCatalogItem>(endpoints[category ?? 'trails'], params),
  });
}
