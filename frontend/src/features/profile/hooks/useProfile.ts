import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getData, type ApiEnvelope } from '@/lib/api/client';
import type { Competence } from '@/types/competence';
import type { Profile } from '@/types/profile';
import type { Project } from '@/types/project';

export interface ProfileUpdate {
  nome?: string;
  idade?: number | null;
  situacao?: string;
  localizacao?: string;
  interesses?: string[];
  objetivo?: string;
  bio?: string;
  linkedin?: string | null;
  portfolio?: string | null;
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
      if (changes.nome !== undefined) {
        await queryClient.invalidateQueries({ queryKey: ['me'] });
      }
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

export type ProfileMedia = 'foto' | 'banner';

/** Largest file accepted by the API for each image, in bytes. */
export const PROFILE_MEDIA_MAX_BYTES: Record<ProfileMedia, number> = {
  foto: 4 * 1024 * 1024,
  banner: 6 * 1024 * 1024,
};

/** Uploads (with a file) or removes (with null) the profile photo or banner. */
export function useProfileMedia(userId: string, media: ProfileMedia) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File | null) => {
      if (!file) {
        const { data } = await api.delete<ApiEnvelope<Profile>>(`/me/profile/${media}`);
        return data.data;
      }
      const body = new FormData();
      body.append('imagem', file);
      const { data } = await api.post<ApiEnvelope<Profile>>(`/me/profile/${media}`, body, { timeout: 60_000 });
      return data.data;
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(['profile', userId], profile);
    },
  });
}

export interface ProjectInput {
  titulo: string;
  descricao: string;
  tipo: Project['tipo'];
  link: string | null;
  competencias: string[];
}

export function useSaveProject(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: ProjectInput & { id?: string }) => {
      const { data } = id
        ? await api.put<ApiEnvelope<Project>>(`/me/projects/${id}`, input)
        : await api.post<ApiEnvelope<Project>>('/me/projects', input);
      return data.data;
    },
    onSuccess: async (_project, input) => {
      await queryClient.invalidateQueries({ queryKey: ['projects', userId] });
      if (!input.id) {
        await queryClient.invalidateQueries({ queryKey: ['achievements'] });
      }
    },
  });
}

export function useDeleteProject(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/me/projects/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects', userId] }),
  });
}
