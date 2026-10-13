import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { Competence } from '@/types/competence';
import type { Profile } from '@/types/profile';
import type { Project } from '@/types/project';

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Profile | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { profileHandler } = await import('@/lib/mocks/handlers/profile.handler');
        return profileHandler.detail(userId);
      }
      const { data } = await api.get<Profile | null>(
        `/users/${encodeURIComponent(userId)}/profile`,
      );
      return data;
    },
  });
}

export function useProfileCompetences(userId: string) {
  return useQuery({
    queryKey: ['profile', userId, 'competences'],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Competence[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { profileHandler } = await import('@/lib/mocks/handlers/profile.handler');
        return profileHandler.competences(userId);
      }
      const { data } = await api.get<Competence[]>(
        `/users/${encodeURIComponent(userId)}/competences`,
      );
      return data;
    },
  });
}

export function useProjects(userId: string) {
  return useQuery({
    queryKey: ['projects', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Project[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { projectsHandler } = await import('@/lib/mocks/handlers/projects.handler');
        return projectsHandler.list();
      }
      const { data } = await api.get<Project[]>(
        `/users/${encodeURIComponent(userId)}/projects`,
      );
      return data;
    },
  });
}
