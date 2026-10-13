import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { Experience } from '@/types/experience';
import type { CatalogParams } from '@/features/learn/hooks/useTrails';

export function useExperiences(params?: CatalogParams) {
  return useQuery({
    queryKey: ['experiences', params],
    queryFn: async (): Promise<Experience[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { experiencesHandler } = await import('@/lib/mocks/handlers/experiences.handler');
        return experiencesHandler.list(params);
      }
      const { data } = await api.get<Experience[]>('/experiences', { params });
      return data;
    },
  });
}

export function useExperience(slug: string) {
  return useQuery({
    queryKey: ['experiences', slug],
    enabled: Boolean(slug),
    queryFn: async (): Promise<Experience | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { experiencesHandler } = await import('@/lib/mocks/handlers/experiences.handler');
        return experiencesHandler.detail(slug);
      }
      const { data } = await api.get<Experience | null>(
        `/experiences/${encodeURIComponent(slug)}`,
      );
      return data;
    },
  });
}
