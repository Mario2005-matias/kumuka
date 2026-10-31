import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getData, getPage } from '@/lib/api/client';
import type { Trail, TrailModule } from '@/types/trail';

export interface CatalogParams {
  search?: string;
  nivel?: Trail['nivel'];
  categoria?: string;
  duracao?: 'menos-5' | '5-10' | 'mais-10';
  page?: number;
  pageSize?: number;
}

export function useTrails(params?: CatalogParams) {
  return useQuery({
    queryKey: ['trails', 'list', params],
    queryFn: () => getPage<Trail>('/trails', params),
    placeholderData: keepPreviousData,
  });
}

export function useTrail(slug: string) {
  return useQuery({
    queryKey: ['trails', 'detail', slug],
    enabled: Boolean(slug),
    queryFn: () => getData<Trail>(`/trails/${encodeURIComponent(slug)}`),
  });
}

/**
 * Full module content. The API answers 403 while the module is locked.
 */
export function useTrailModule(slug: string, moduleId: string, enabled = true) {
  return useQuery({
    queryKey: ['trails', 'detail', slug, 'modules', moduleId],
    enabled: Boolean(slug && moduleId) && enabled,
    queryFn: () =>
      getData<TrailModule>(
        `/trails/${encodeURIComponent(slug)}/modules/${encodeURIComponent(moduleId)}`,
      ),
  });
}
