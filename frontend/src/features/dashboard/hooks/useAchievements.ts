import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { Achievement } from '@/types/achievement';

export function useAchievements(userId: string) {
  return useQuery({
    queryKey: ['achievements', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Achievement[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { achievementsHandler } = await import('@/lib/mocks/handlers/achievements.handler');
        return achievementsHandler.list(userId);
      }
      const { data } = await api.get<Achievement[]>(
        `/users/${encodeURIComponent(userId)}/achievements`,
      );
      return data;
    },
  });
}
