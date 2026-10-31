import { useQuery } from '@tanstack/react-query';
import { getData } from '@/lib/api/client';
import type { Achievement } from '@/types/achievement';

export function useAchievements(userId: string) {
  return useQuery({
    queryKey: ['achievements', userId],
    enabled: Boolean(userId),
    queryFn: () => getData<Achievement[]>('/me/achievements'),
  });
}
