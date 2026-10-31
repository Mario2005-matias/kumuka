import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getData, getPage } from '@/lib/api/client';
import type { QuickLearning } from '@/types/quick-learning';
import type { CatalogParams } from './useTrails';

export function useQuickLearnings(params?: CatalogParams) {
  return useQuery({
    queryKey: ['quick-learnings', 'list', params],
    queryFn: () => getPage<QuickLearning>('/quick-learnings', params),
    placeholderData: keepPreviousData,
  });
}

export function useQuickLearning(slug: string) {
  return useQuery({
    queryKey: ['quick-learnings', 'detail', slug],
    enabled: Boolean(slug),
    queryFn: () => getData<QuickLearning>(`/quick-learnings/${encodeURIComponent(slug)}`),
  });
}
