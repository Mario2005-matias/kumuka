import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getData, type ApiEnvelope } from '@/lib/api/client';
import type {
  ActivitySubmission,
  Answer,
  BlockProgress,
  ModuleQuizStatus,
  QuizAttempt,
  Trail,
  TrailEnrollment,
  TrailProgress,
} from '@/types/trail';

export interface VideoHeartbeatInput {
  blockId: string;
  /** Current playback position in seconds. */
  position: number;
}

export interface SubmitActivityInput {
  activityId: string;
  answer?: string;
  file?: File;
}

export type Answers = Record<string, Answer>;

const progressKey = (slug: string) => ['trail-progress', slug] as const;

function progressPath(slug: string) {
  return `/me/trails/${encodeURIComponent(slug)}/progress`;
}

/**
 * Detailed, server-computed progress of the student in a trail.
 */
export function useTrailProgress(slug: string) {
  return useQuery({
    queryKey: progressKey(slug),
    enabled: Boolean(slug),
    queryFn: () => getData<TrailProgress>(progressPath(slug)),
  });
}

/**
 * Every trail the student has started.
 */
export function useEnrollments(enabled = true) {
  return useQuery({
    queryKey: ['enrollments'],
    enabled,
    queryFn: () => getData<TrailEnrollment[]>('/me/trails'),
  });
}

function useRefreshProgress(slug: string) {
  const queryClient = useQueryClient();
  return async (progress?: TrailProgress) => {
    if (progress) queryClient.setQueryData(progressKey(slug), progress);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: progressKey(slug) }),
      queryClient.invalidateQueries({ queryKey: ['enrollments'] }),
      queryClient.invalidateQueries({ queryKey: ['recommendations'] }),
    ]);
  };
}

export function useStartTrail(trail: Trail) {
  const refresh = useRefreshProgress(trail.slug);
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<ApiEnvelope<TrailProgress>>(
        `/me/trails/${encodeURIComponent(trail.slug)}/enrollment`,
      );
      return data.data;
    },
    onSuccess: (progress) => refresh(progress),
  });
}

/**
 * Reports video playback. The server only credits segments that were actually played and
 * completes the lesson on its own, so the trail progress is refetched when a video is done.
 */
export function useVideoHeartbeat(slug: string) {
  const queryClient = useQueryClient();
  const refresh = useRefreshProgress(slug);

  return useMutation({
    mutationFn: async ({ blockId, position }: VideoHeartbeatInput) => {
      const { data } = await api.post<ApiEnvelope<BlockProgress & { blockId: string }>>(
        `/me/blocks/${encodeURIComponent(blockId)}/heartbeats`,
        { position },
      );
      return data.data;
    },
    onSuccess: async ({ blockId, ...block }) => {
      const previous = queryClient.getQueryData<TrailProgress>(progressKey(slug));
      const wasComplete = previous?.blocos[blockId]?.concluido ?? false;
      if (previous) {
        queryClient.setQueryData<TrailProgress>(progressKey(slug), {
          ...previous,
          blocos: { ...previous.blocos, [blockId]: block },
        });
      }
      if (block.concluido && !wasComplete) await refresh();
    },
  });
}

/** Completes a lesson that has nothing to watch and no checkpoint. */
export function useMarkLessonRead(slug: string) {
  const refresh = useRefreshProgress(slug);
  return useMutation({
    mutationFn: async (lessonId: string) => {
      await api.post(`/me/lessons/${encodeURIComponent(lessonId)}/read`);
    },
    onSuccess: () => refresh(),
  });
}

/** Grades the end-of-lesson checkpoint; every answer must be right to complete the lesson. */
export function useSubmitCheckpoint(slug: string) {
  const refresh = useRefreshProgress(slug);
  return useMutation({
    mutationFn: async ({ lessonId, answers }: { lessonId: string; answers: Answers }) => {
      const { data } = await api.post<ApiEnvelope<QuizAttempt>>(
        `/me/lessons/${encodeURIComponent(lessonId)}/checkpoint`,
        { answers },
      );
      return data.data;
    },
    onSuccess: async (attempt) => {
      if (attempt.aprovada) await refresh();
    },
  });
}

const quizStatusKey = (moduleId: string) => ['module-quiz', moduleId] as const;

export function useModuleQuizStatus(moduleId: string, enabled = true) {
  return useQuery({
    queryKey: quizStatusKey(moduleId),
    enabled: Boolean(moduleId) && enabled,
    queryFn: () => getData<ModuleQuizStatus>(`/me/modules/${encodeURIComponent(moduleId)}/quiz`),
  });
}

/** Starts a quiz attempt, or resumes the open one, with questions drawn from the bank. */
export function useStartQuiz(moduleId: string) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<ApiEnvelope<QuizAttempt>>(
        `/me/modules/${encodeURIComponent(moduleId)}/quiz-attempts`,
      );
      return data.data;
    },
  });
}

export function useSubmitQuiz(slug: string, moduleId: string) {
  const queryClient = useQueryClient();
  const refresh = useRefreshProgress(slug);
  return useMutation({
    mutationFn: async ({ attemptId, answers }: { attemptId: string; answers: Answers }) => {
      const { data } = await api.post<ApiEnvelope<QuizAttempt>>(
        `/me/quiz-attempts/${encodeURIComponent(attemptId)}/submission`,
        { answers },
      );
      return data.data;
    },
    onSuccess: async () => {
      await Promise.all([
        refresh(),
        queryClient.invalidateQueries({ queryKey: quizStatusKey(moduleId) }),
        queryClient.invalidateQueries({ queryKey: ['achievements'] }),
      ]);
    },
  });
}

export function useSaveActivityDraft(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ activityId, answer }: { activityId: string; answer: string }) => {
      const { data } = await api.put<ApiEnvelope<ActivitySubmission>>(
        `/me/activities/${encodeURIComponent(activityId)}/draft`,
        { answer },
      );
      return data.data;
    },
    onSuccess: (submission) => {
      queryClient.setQueryData<TrailProgress>(progressKey(slug), (previous) =>
        previous
          ? {
              ...previous,
              atividades: { ...previous.atividades, [submission.activityId]: submission },
            }
          : previous,
      );
    },
  });
}

export function useSubmitActivity(slug: string) {
  const queryClient = useQueryClient();
  const refresh = useRefreshProgress(slug);

  return useMutation({
    mutationFn: async ({ activityId, answer, file }: SubmitActivityInput) => {
      const url = `/me/activities/${encodeURIComponent(activityId)}/submission`;
      let body: FormData | object;
      if (file) {
        const form = new FormData();
        form.append('file', file);
        if (answer) form.append('answer', answer);
        body = form;
      } else {
        body = { answer };
      }
      const { data } = await api.post<ApiEnvelope<ActivitySubmission>>(url, body);
      return data.data;
    },
    onSuccess: async () => {
      await Promise.all([
        refresh(),
        queryClient.invalidateQueries({ queryKey: ['achievements'] }),
      ]);
    },
  });
}
