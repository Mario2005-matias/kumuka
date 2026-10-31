import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getData, getPage, type ApiEnvelope } from '@/lib/api/client';
import type { Opportunity, OpportunityApplication } from '@/types/opportunity';

export interface OpportunityCatalogParams {
  search?: string;
  tipo?: Opportunity['tipo'];
  area?: string;
  empresa?: string;
  localizacao?: string;
  modalidade?: Opportunity['modalidade'];
  prazo?: 'semana' | 'mes' | 'tres-meses';
  page?: number;
  pageSize?: number;
}

export function useOpportunities(params?: OpportunityCatalogParams) {
  return useQuery({
    queryKey: ['opportunities', 'list', params],
    queryFn: () => getPage<Opportunity>('/opportunities', params),
    placeholderData: keepPreviousData,
  });
}

export function useOpportunity(slug: string) {
  return useQuery({
    queryKey: ['opportunities', 'detail', slug],
    enabled: Boolean(slug),
    queryFn: () => getData<Opportunity>(`/opportunities/${encodeURIComponent(slug)}`),
  });
}

export function useOpportunityApplications(userId: string) {
  return useQuery({
    queryKey: ['opportunity-applications', userId],
    enabled: Boolean(userId),
    queryFn: () => getData<OpportunityApplication[]>('/me/opportunity-applications'),
  });
}

export function useApplyToOpportunity(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (opportunityId: string) => {
      const { data } = await api.post<ApiEnvelope<OpportunityApplication>>(
        '/me/opportunity-applications',
        { opportunityId: Number(opportunityId) },
      );
      return data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['opportunity-applications', userId] });
    },
  });
}
