import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getData, type ApiEnvelope } from '@/lib/api/client';
import type {
  ActivitySubmission,
  LessonProgress,
  Trail,
  TrailEnrollment,
  TrailProgress,
} from '@/types/trail';

export type HeartbeatEvent = 'progress' | 'opened' | 'ended';

export interface HeartbeatInput {
  lessonId: string;
  event: HeartbeatEvent;
  /** Current video position in seconds. */
  position?: number;
  /** Whether the student scrolled to the end of a text lesson. */
  reachedEnd?: boolean;
}

export interface SubmitActivityInput {
  activityId: string;
  answer?: string;
  answers?: Record<string, string>;
  file?: File;
}

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
 * Sends lesson heartbeats and merges the server's verdict into the cached progress.
 * When a lesson completes, the whole trail progress is refetched because the module
 * (and the next one's lock) may have changed.
 */
export function useLessonHeartbeat(slug: string) {
  const queryClient = useQueryClient();
  const refresh = useRefreshProgress(slug);

  return useMutation({
    mutationFn: async ({ lessonId, ...body }: HeartbeatInput) => {
      const { data } = await api.post<ApiEnvelope<LessonProgress>>(
        `/me/lessons/${encodeURIComponent(lessonId)}/heartbeats`,
        body,
      );
      return data.data;
    },
    onSuccess: async (lesson) => {
      const previous = queryClient.getQueryData<TrailProgress>(progressKey(slug));
      const wasComplete = previous?.aulas[lesson.lessonId]?.concluida ?? false;
      if (previous) {
        queryClient.setQueryData<TrailProgress>(progressKey(slug), {
          ...previous,
          aulas: { ...previous.aulas, [lesson.lessonId]: lesson },
        });
      }
      if (lesson.concluida && !wasComplete) await refresh();
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
    mutationFn: async ({ activityId, answer, answers, file }: SubmitActivityInput) => {
      const url = `/me/activities/${encodeURIComponent(activityId)}/submission`;
      let body: FormData | object;
      if (file) {
        const form = new FormData();
        form.append('file', file);
        if (answer) form.append('answer', answer);
        body = form;
      } else {
        body = answers ? { answers } : { answer };
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
