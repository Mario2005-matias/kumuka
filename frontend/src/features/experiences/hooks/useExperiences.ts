import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
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

function registrationsPath(userId: string) {
  return `/users/${encodeURIComponent(userId)}/experience-registrations`;
}

export function useExperiences(params?: ExperienceCatalogParams, userId = '') {
  return useQuery({
    queryKey: ['experiences', params, userId],
    queryFn: async (): Promise<Experience[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { experiencesHandler } = await import('@/lib/mocks/handlers/experiences.handler');
        return experiencesHandler.list(params, userId);
      }
      const { data } = await api.get<Experience[]>('/experiences', { params });
      return data;
    },
  });
}

export function useExperience(slug: string, userId = '') {
  return useQuery({
    queryKey: ['experiences', slug, userId],
    enabled: Boolean(slug),
    queryFn: async (): Promise<Experience | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { experiencesHandler } = await import('@/lib/mocks/handlers/experiences.handler');
        return experiencesHandler.detail(slug, userId);
      }
      const { data } = await api.get<Experience | null>(
        `/experiences/${encodeURIComponent(slug)}`,
      );
      return data;
    },
  });
}

export function useRegisterExperience(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (experienceId: string): Promise<ExperienceRegistration> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { experiencesHandler } = await import('@/lib/mocks/handlers/experiences.handler');
        return experiencesHandler.register(userId, experienceId);
      }
      const { data } = await api.post<ExperienceRegistration>(
        registrationsPath(userId),
        { experienceId },
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['experiences'] });
      await queryClient.invalidateQueries({ queryKey: ['experience-registrations', userId] });
    },
  });
}
