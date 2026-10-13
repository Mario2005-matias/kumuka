import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { Recommendation } from '@/types/recommendation';

export function useRecommendations(userId: string) {
  return useQuery({
    queryKey: ['recommendations', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Recommendation[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { recommendationsHandler } = await import('@/lib/mocks/handlers/recommendations.handler');
        return recommendationsHandler.list();
      }
      const { data } = await api.get<Recommendation[]>('/recommendations');
      return data;
    },
  });
}
