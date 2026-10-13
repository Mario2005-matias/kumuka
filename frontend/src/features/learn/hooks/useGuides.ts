import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { Guide } from '@/types/guide';
import type { CatalogParams } from './useTrails';

export function useGuides(params?: CatalogParams) {
  return useQuery({
    queryKey: ['guides', params],
    queryFn: async (): Promise<Guide[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { guidesHandler } = await import('@/lib/mocks/handlers/guides.handler');
        return guidesHandler.list(params);
      }
      const { data } = await api.get<Guide[]>('/guides', { params });
      return data;
    },
  });
}

export function useGuide(slug: string) {
  return useQuery({
    queryKey: ['guides', slug],
    enabled: Boolean(slug),
    queryFn: async (): Promise<Guide | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { guidesHandler } = await import('@/lib/mocks/handlers/guides.handler');
        return guidesHandler.detail(slug);
      }
      const { data } = await api.get<Guide | null>(`/guides/${encodeURIComponent(slug)}`);
      return data;
    },
  });
}
