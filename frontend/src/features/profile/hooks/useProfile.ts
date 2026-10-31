import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getData, type ApiEnvelope } from '@/lib/api/client';
import type { Competence } from '@/types/competence';
import type { Profile } from '@/types/profile';
import type { Project } from '@/types/project';

export interface ProfileUpdate {
  nome?: string;
  idade?: number | null;
  situacao?: string;
  interesses?: string[];
  objetivo?: string;
  bio?: string;
  onboardingStep?: number;
  onboardingCompleted?: true;
}

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    enabled: Boolean(userId),
    queryFn: () => getData<Profile>('/me/profile'),
  });
}

export function useUpdateProfile(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (changes: ProfileUpdate) => {
      const { data } = await api.patch<ApiEnvelope<Profile>>('/me/profile', changes);
      return data.data;
    },
    onSuccess: async (profile, changes) => {
      queryClient.setQueryData(['profile', userId], profile);
      if (changes.onboardingCompleted) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['me'] }),
          queryClient.invalidateQueries({ queryKey: ['achievements'] }),
        ]);
      }
    },
  });
}

export function useProfileCompetences(userId: string) {
  return useQuery({
    queryKey: ['profile', userId, 'competences'],
    enabled: Boolean(userId),
    queryFn: () => getData<Competence[]>('/me/competences'),
  });
}

export function useProjects(userId: string) {
  return useQuery({
    queryKey: ['projects', userId],
    enabled: Boolean(userId),
    queryFn: () => getData<Project[]>('/me/projects'),
  });
}
