import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getData, getPage, type ApiEnvelope } from '@/lib/api/client';
import type { Experience, ExperienceRegistration, TipoExperiencia } from '@/types/experience';

export interface ExperienceCatalogParams {
  search?: string;
  tipo?: TipoExperiencia;
  modalidade?: Experience['modalidade'];
  periodo?: 'semana' | 'mes' | 'tres-meses';
  localizacao?: string;
  page?: number;
  pageSize?: number;
}

export function useExperiences(params?: ExperienceCatalogParams) {
  return useQuery({
    queryKey: ['experiences', 'list', params],
    queryFn: () => getPage<Experience>('/experiences', params),
    placeholderData: keepPreviousData,
  });
}

export function useExperience(slug: string) {
  return useQuery({
    queryKey: ['experiences', 'detail', slug],
    enabled: Boolean(slug),
    queryFn: () => getData<Experience>(`/experiences/${encodeURIComponent(slug)}`),
  });
}

export function useRegisterExperience(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (experienceId: string) => {
      const { data } = await api.post<ApiEnvelope<ExperienceRegistration>>(
        '/me/experience-registrations',
        { experienceId: Number(experienceId) },
      );
      return data.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['experiences'] });
      await queryClient.invalidateQueries({ queryKey: ['experience-registrations', userId] });
    },
  });
}
