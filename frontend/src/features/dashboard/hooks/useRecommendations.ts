import { useQuery } from '@tanstack/react-query';
import { getData } from '@/lib/api/client';
import type { Recommendation } from '@/types/recommendation';

export function useRecommendations(userId: string) {
  return useQuery({
    queryKey: ['recommendations', userId],
    enabled: Boolean(userId),
    queryFn: () => getData<Recommendation[]>('/me/recommendations'),
  });
}
