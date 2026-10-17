import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { Course, CourseModule, CourseProgress } from '@/types/course';

type ReadInput = { moduleId: string; contentId: string };
type ModuleInput = { moduleId: string };
type AnswerInput = ModuleInput & { answer: string };

function progressPath(userId: string, courseId: string) {
  return `/users/${encodeURIComponent(userId)}/courses/${encodeURIComponent(courseId)}/progress`;
}

function useInvalidateCourseProgress(userId: string, courseId: string) {
  const queryClient = useQueryClient();
  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['course-progress', userId, courseId] }),
      queryClient.invalidateQueries({ queryKey: ['course-progress-list', userId] }),
      queryClient.invalidateQueries({ queryKey: ['progress', userId] }),
      queryClient.invalidateQueries({ queryKey: ['courses'] }),
    ]);
  };
}

export function useCourseProgress(userId: string, courseId: string) {
  return useQuery({
    queryKey: ['course-progress', userId, courseId],
    enabled: Boolean(userId && courseId),
    queryFn: async (): Promise<CourseProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { courseProgressHandler } = await import(
          '@/lib/mocks/handlers/courseProgress.handler'
        );
        return courseProgressHandler.get(userId, courseId);
      }
      const { data } = await api.get<CourseProgress>(progressPath(userId, courseId));
      return data;
    },
  });
}

export function useCourseProgressList(userId: string) {
  return useQuery({
    queryKey: ['course-progress-list', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<CourseProgress[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { courseProgressHandler } = await import(
          '@/lib/mocks/handlers/courseProgress.handler'
        );
        return courseProgressHandler.list(userId);
      }
      const { data } = await api.get<CourseProgress[]>(
        `/users/${encodeURIComponent(userId)}/courses/progress`,
      );
      return data;
    },
  });
}

export function useStartCourse(userId: string, course: Course) {
  const invalidate = useInvalidateCourseProgress(userId, course.id);
  return useMutation({
    mutationFn: async (): Promise<CourseProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { coursesHandler } = await import('@/lib/mocks/handlers/courses.handler');
        return coursesHandler.start(userId, course.id);
      }
      const { data } = await api.post<CourseProgress>(progressPath(userId, course.id));
      return data;
    },
    onSuccess: invalidate,
  });
}

export function useMarkCourseContentRead(userId: string, course: Course) {
  const invalidate = useInvalidateCourseProgress(userId, course.id);
  return useMutation({
    mutationFn: async (input: ReadInput): Promise<CourseProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { coursesHandler } = await import('@/lib/mocks/handlers/courses.handler');
        return coursesHandler.markContentRead(
          userId, course.id, input.moduleId, input.contentId,
        );
      }
      const { data } = await api.post<CourseProgress>(
        `${progressPath(userId, course.id)}/modules/${encodeURIComponent(input.moduleId)}/read`,
        { contentId: input.contentId },
      );
      return data;
    },
    onSuccess: invalidate,
  });
}

export function useSaveCourseDraft(userId: string, course: Course) {
  const invalidate = useInvalidateCourseProgress(userId, course.id);
  return useMutation({
    mutationFn: async (input: AnswerInput): Promise<CourseProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { coursesHandler } = await import('@/lib/mocks/handlers/courses.handler');
        return coursesHandler.saveDraft(userId, course.id, input.moduleId, input.answer);
      }
      const { data } = await api.put<CourseProgress>(
        `${progressPath(userId, course.id)}/modules/${encodeURIComponent(input.moduleId)}/draft`,
        { answer: input.answer },
      );
      return data;
    },
    onSuccess: invalidate,
  });
}

export function useSubmitCourseActivity(userId: string, course: Course) {
  const invalidate = useInvalidateCourseProgress(userId, course.id);
  return useMutation({
    mutationFn: async (input: AnswerInput): Promise<CourseProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { coursesHandler } = await import('@/lib/mocks/handlers/courses.handler');
        return coursesHandler.submitActivity(userId, course.id, input.moduleId, input.answer);
      }
      const { data } = await api.post<CourseProgress>(
        `${progressPath(userId, course.id)}/modules/${encodeURIComponent(input.moduleId)}/activities`,
        { answer: input.answer },
      );
      return data;
    },
    onSuccess: invalidate,
  });
}

export function useCompleteCourseModule(userId: string, course: Course) {
  const invalidate = useInvalidateCourseProgress(userId, course.id);
  return useMutation({
    mutationFn: async (input: ModuleInput): Promise<CourseProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { coursesHandler } = await import('@/lib/mocks/handlers/courses.handler');
        return coursesHandler.completeModule(userId, course.id, input.moduleId);
      }
      const { data } = await api.post<CourseProgress>(
        `${progressPath(userId, course.id)}/modules/${encodeURIComponent(input.moduleId)}/complete`,
      );
      return data;
    },
    onSuccess: invalidate,
  });
}

export function useCompleteCourse(userId: string, course: Course) {
  const invalidate = useInvalidateCourseProgress(userId, course.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<CourseProgress> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { coursesHandler } = await import('@/lib/mocks/handlers/courses.handler');
        return coursesHandler.completeCourse(userId, course.id);
      }
      const { data } = await api.post<CourseProgress>(
        `${progressPath(userId, course.id)}/complete`,
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

export function isAccessibleCourseModule(
  course: Course,
  progress: CourseProgress | null | undefined,
  moduleId: string,
): boolean {
  const module = course.modulos.find((item: CourseModule) => item.id === moduleId);
  if (!module) return false;
  if (!progress) return module.ordem === 1;
  if (progress.estado === 'concluido') return true;
  return (
    module.ordem === 1 ||
    progress.modulosConcluidos.includes(course.modulos[module.ordem - 2]?.id ?? '')
  );
}
