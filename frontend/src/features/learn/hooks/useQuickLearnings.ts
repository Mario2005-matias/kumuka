import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { QuickLearning } from '@/types/quick-learning';
import type { CatalogParams } from './useTrails';

export function useQuickLearnings(params?: CatalogParams) {
  return useQuery({
    queryKey: ['quick-learnings', params],
    queryFn: async (): Promise<QuickLearning[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { quickLearningsHandler } = await import('@/lib/mocks/handlers/quickLearnings.handler');
        return quickLearningsHandler.list(params);
      }
      const { data } = await api.get<QuickLearning[]>('/quick-learnings', { params });
      return data;
    },
  });
}

export function useQuickLearning(slug: string) {
  return useQuery({
    queryKey: ['quick-learnings', slug],
    enabled: Boolean(slug),
    queryFn: async (): Promise<QuickLearning | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { quickLearningsHandler } = await import('@/lib/mocks/handlers/quickLearnings.handler');
        return quickLearningsHandler.detail(slug);
      }
      const { data } = await api.get<QuickLearning | null>(
        `/quick-learnings/${encodeURIComponent(slug)}`,
      );
      return data;
    },
  });
}
