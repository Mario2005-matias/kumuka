import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { LearningProgress } from '@/types/progress';
import type { Trail, TrailModule, TrailProgress } from '@/types/trail';
import { useTrailModule } from './useTrails';

type ContentReadInput = { moduleId: string; contentId: string };
type ActivityInput = { moduleId: string; answer: string };
type ModuleInput = { moduleId: string };
type DraftInput = ActivityInput;

function progressPath(userId: string, trailId: string) {
  return `/users/${encodeURIComponent(userId)}/trails/${encodeURIComponent(trailId)}/progress`;
}

function useInvalidateTrailProgress(userId: string, trailId: string) {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['trail-progress', userId, trailId],
      }),
      queryClient.invalidateQueries({ queryKey: ['progress', userId] }),
      queryClient.invalidateQueries({ queryKey: ['trails'] }),
    ]);
  };
}

/**
 * Lê o progresso detalhado do utilizador numa trilha.
 */
export function useTrailProgress(userId: string, trailId: string) {
  return useQuery({
    queryKey: ['trail-progress', userId, trailId],
    enabled: Boolean(userId && trailId),
    queryFn: async (): Promise<TrailProgress | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { progressHandler } = await import(
          '@/lib/mocks/handlers/progress.handler'
        );
        return progressHandler.get(userId, trailId);
      }
      const { data } = await api.get<TrailProgress | null>(
        progressPath(userId, trailId),
      );
      return data;
    },
  });
}

/**
 * Acede ao detalhe de um módulo de trilha.
 */
export function useModule(slug: string, moduleId: string) {
  return useTrailModule(slug, moduleId);
}

/**
 * Inicia uma trilha e encaminha o progresso inicial.
 */
export function useStartTrail(userId: string, trail: Trail) {
  const invalidate = useInvalidateTrailProgress(userId, trail.id);

  return useMutation({
    mutationFn: async (): Promise<TrailProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { trailsHandler } = await import(
          '@/lib/mocks/handlers/trails.handler'
        );
        return trailsHandler.start(userId, trail.id);
      }
      const { data } = await api.post<TrailProgress>(
        progressPath(userId, trail.id),
      );
      return data;
    },
    onSuccess: invalidate,
  });
}

/**
 * Guarda que um conteúdo foi lido.
 */
export function useMarkContentRead(userId: string, trail: Trail) {
  const invalidate = useInvalidateTrailProgress(userId, trail.id);

  return useMutation({
    mutationFn: async (input: ContentReadInput): Promise<TrailProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { trailsHandler } = await import(
          '@/lib/mocks/handlers/trails.handler'
        );
        return trailsHandler.markContentRead(
          userId,
          trail.id,
          input.moduleId,
          input.contentId,
        );
      }
      const { data } = await api.post<TrailProgress>(
        `${progressPath(userId, trail.id)}/modules/${encodeURIComponent(input.moduleId)}/read`,
        { contentId: input.contentId },
      );
      return data;
    },
    onSuccess: invalidate,
  });
}

/**
 * Guarda o rascunho de uma actividade no progresso local ou na API.
 */
export function useSaveTrailDraft(userId: string, trail: Trail) {
  const invalidate = useInvalidateTrailProgress(userId, trail.id);

  return useMutation({
    mutationFn: async (input: DraftInput): Promise<TrailProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { trailsHandler } = await import(
          '@/lib/mocks/handlers/trails.handler'
        );
        return trailsHandler.saveDraft(
          userId,
          trail.id,
          input.moduleId,
          input.answer,
        );
      }
      const { data } = await api.put<TrailProgress>(
        `${progressPath(userId, trail.id)}/modules/${encodeURIComponent(input.moduleId)}/draft`,
        { answer: input.answer },
      );
      return data;
    },
    onSuccess: invalidate,
  });
}

/**
 * Submete a actividade do módulo actual.
 */
export function useSubmitTrailActivity(userId: string, trail: Trail) {
  const invalidate = useInvalidateTrailProgress(userId, trail.id);

  return useMutation({
    mutationFn: async (input: ActivityInput): Promise<TrailProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { trailsHandler } = await import(
          '@/lib/mocks/handlers/trails.handler'
        );
        return trailsHandler.submitActivity(
          userId,
          trail.id,
          input.moduleId,
          input.answer,
        );
      }
      const { data } = await api.post<TrailProgress>(
        `${progressPath(userId, trail.id)}/modules/${encodeURIComponent(input.moduleId)}/activities`,
        { answer: input.answer },
      );
      return data;
    },
    onSuccess: invalidate,
  });
}

/**
 * Conclui o módulo actual depois de validar conteúdos e actividade.
 */
export function useCompleteModule(userId: string, trail: Trail) {
  const invalidate = useInvalidateTrailProgress(userId, trail.id);

  return useMutation({
    mutationFn: async (input: ModuleInput): Promise<TrailProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { trailsHandler } = await import(
          '@/lib/mocks/handlers/trails.handler'
        );
        return trailsHandler.completeModule(
          userId,
          trail.id,
          input.moduleId,
        );
      }
      const { data } = await api.post<TrailProgress>(
        `${progressPath(userId, trail.id)}/modules/${encodeURIComponent(input.moduleId)}/complete`,
      );
      return data;
    },
    onSuccess: invalidate,
  });
}

/**
 * Finaliza a trilha e desbloqueia a conquista correspondente.
 */
export function useCompleteTrail(userId: string, trail: Trail) {
  const invalidate = useInvalidateTrailProgress(userId, trail.id);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<TrailProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { progressHandler } = await import(
          '@/lib/mocks/handlers/progress.handler'
        );
        return progressHandler.completeTrail(userId, trail.id);
      }
      const { data } = await api.post<TrailProgress>(
        `${progressPath(userId, trail.id)}/complete`,
      );
      return data;
    },
    onSuccess: async () => {
      await Promise.all([
        invalidate(),
        queryClient.invalidateQueries({ queryKey: ['achievements', userId] }),
      ]);
    },
  });
}

export function useTrailProgressList(userId: string) {
  return useQuery({
    queryKey: ['progress', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<LearningProgress[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { progressHandler } = await import(
          '@/lib/mocks/handlers/progress.handler'
        );
        return progressHandler.list(userId);
      }
      const { data } = await api.get<LearningProgress[]>(
        `/users/${encodeURIComponent(userId)}/progress`,
      );
      return data;
    },
  });
}

export function isAccessibleModule(
  trail: Trail,
  progress: TrailProgress | null | undefined,
  moduleId: string,
): boolean {
  const module = trail.modulos.find((item: TrailModule) => item.id === moduleId);
  if (!module) return false;
  if (!progress) return module.ordem === 1;
  if (progress.estado === 'concluido') return true;
  return (
    module.ordem === 1 ||
    progress.modulosConcluidos.includes(
      trail.modulos[module.ordem - 2]?.id ?? '',
    )
  );
}
