import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { Trail } from '@/types/trail';

export interface CatalogParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useTrails(params?: CatalogParams) {
  return useQuery({
    queryKey: ['trails', params],
    queryFn: async (): Promise<Trail[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { trailsHandler } = await import('@/lib/mocks/handlers/trails.handler');
        return trailsHandler.list(params);
      }
      const { data } = await api.get<Trail[]>('/trails', { params });
      return data;
    },
  });
}

export function useTrail(slug: string) {
  return useQuery({
    queryKey: ['trails', slug],
    enabled: Boolean(slug),
    queryFn: async (): Promise<Trail | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { trailsHandler } = await import('@/lib/mocks/handlers/trails.handler');
        return trailsHandler.detail(slug);
      }
      const { data } = await api.get<Trail | null>(`/trails/${encodeURIComponent(slug)}`);
      return data;
    },
  });
}

export function useTrailModule(slug: string, moduleId: string) {
  return useQuery({
    queryKey: ['trails', slug, 'modules', moduleId],
    enabled: Boolean(slug && moduleId),
    queryFn: async (): Promise<Trail['modulos'][number] | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { trailsHandler } = await import('@/lib/mocks/handlers/trails.handler');
        return trailsHandler.module(slug, moduleId);
      }
      const { data } = await api.get<Trail['modulos'][number] | null>(
        `/trails/${encodeURIComponent(slug)}/modules/${encodeURIComponent(moduleId)}`,
      );
      return data;
    },
  });
}
