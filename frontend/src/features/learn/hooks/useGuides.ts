import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getData, getPage } from '@/lib/api/client';
import type { Guide } from '@/types/guide';
import type { CatalogParams } from './useTrails';

export function useGuides(params?: CatalogParams) {
  return useQuery({
    queryKey: ['guides', 'list', params],
    queryFn: () => getPage<Guide>('/guides', params),
    placeholderData: keepPreviousData,
  });
}

export function useGuide(slug: string) {
  return useQuery({
    queryKey: ['guides', 'detail', slug],
    enabled: Boolean(slug),
    queryFn: () => getData<Guide>(`/guides/${encodeURIComponent(slug)}`),
  });
}
