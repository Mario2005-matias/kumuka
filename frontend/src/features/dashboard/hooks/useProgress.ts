import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { LearningProgress } from '@/types/progress';

export function useProgress(userId: string) {
  return useQuery({
    queryKey: ['progress', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<LearningProgress[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { progressHandler } = await import('@/lib/mocks/handlers/progress.handler');
        return progressHandler.list(userId);
      }
      const { data } = await api.get<LearningProgress[]>(
        `/users/${encodeURIComponent(userId)}/progress`,
      );
      return data;
    },
  });
}
