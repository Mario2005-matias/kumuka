import { useQuery } from '@tanstack/react-query';
import { env } from '@/config/env';
import { api } from '@/lib/api/client';
import type { Course, CourseLevel, CourseModule } from '@/types/course';

export interface CourseCatalogParams {
  search?: string;
  nivel?: CourseLevel;
  categoria?: string;
  duracao?: 'menos-5' | '5-10' | 'mais-10';
  acesso?: Course['acesso'];
  page?: number;
  pageSize?: number;
}

export function useCourses(params?: CourseCatalogParams) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: async (): Promise<Course[]> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { coursesHandler } = await import('@/lib/mocks/handlers/courses.handler');
        return coursesHandler.list(params);
      }
      const { data } = await api.get<Course[]>('/courses', { params });
      return data;
    },
  });
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ['courses', slug],
    enabled: Boolean(slug),
    queryFn: async (): Promise<Course | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { coursesHandler } = await import('@/lib/mocks/handlers/courses.handler');
        return coursesHandler.detail(slug);
      }
      const { data } = await api.get<Course | null>(`/courses/${encodeURIComponent(slug)}`);
      return data;
    },
  });
}

export function useCourseModule(slug: string, moduleId: string) {
  return useQuery({
    queryKey: ['courses', slug, 'modules', moduleId],
    enabled: Boolean(slug && moduleId),
    queryFn: async (): Promise<CourseModule | null> => {
      if (env.useMocks && import.meta.env.DEV) {
        const { coursesHandler } = await import('@/lib/mocks/handlers/courses.handler');
        return coursesHandler.module(slug, moduleId);
      }
      const { data } = await api.get<CourseModule | null>(
        `/courses/${encodeURIComponent(slug)}/modules/${encodeURIComponent(moduleId)}`,
      );
      return data;
    },
  });
}
