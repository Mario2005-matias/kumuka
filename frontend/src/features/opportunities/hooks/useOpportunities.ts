import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
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
    queryKey: ['opportunities', params],
    queryFn: async (): Promise<Opportunity[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { opportunitiesHandler } = await import('@/lib/mocks/handlers/opportunities.handler');
        return opportunitiesHandler.list(params);
      }
      const { data } = await api.get<Opportunity[]>('/opportunities', { params });
      return data;
    },
  });
}

export function useOpportunity(slug: string) {
  return useQuery({
    queryKey: ['opportunities', slug],
    enabled: Boolean(slug),
    queryFn: async (): Promise<Opportunity | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { opportunitiesHandler } = await import('@/lib/mocks/handlers/opportunities.handler');
        return opportunitiesHandler.detail(slug);
      }
      const { data } = await api.get<Opportunity | null>(
        `/opportunities/${encodeURIComponent(slug)}`,
      );
      return data;
    },
  });
}

export function useOpportunityApplications(userId: string) {
  return useQuery({
    queryKey: ['opportunity-applications', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<OpportunityApplication[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { opportunitiesHandler } = await import('@/lib/mocks/handlers/opportunities.handler');
        return opportunitiesHandler.applications(userId);
      }
      const { data } = await api.get<OpportunityApplication[]>(
        `/users/${encodeURIComponent(userId)}/opportunity-applications`,
      );
      return data;
    },
  });
}

export function useApplyToOpportunity(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (opportunityId: string): Promise<OpportunityApplication> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { opportunitiesHandler } = await import('@/lib/mocks/handlers/opportunities.handler');
        return opportunitiesHandler.apply(userId, opportunityId);
      }
      const { data } = await api.post<OpportunityApplication>(
        `/users/${encodeURIComponent(userId)}/opportunity-applications`,
        { opportunityId },
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['opportunity-applications', userId] });
    },
  });
}
