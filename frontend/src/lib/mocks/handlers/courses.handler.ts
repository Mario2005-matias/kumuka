import { mockCourses } from '../data/courses';
import { delay } from '../utils/delay';
import { paginate } from '../utils/paginate';
import { search } from '../utils/search';
import { sort } from '../utils/sort';
import type { PaginationParams } from '../types/mock.types';
import type { Course } from '@/types/course';

type CourseParams = PaginationParams & { search?: string };

/**
 * Handler de cursos.
 * Simula GET /api/courses, GET /api/courses/:slug e GET /api/courses/:slug/modules/:id.
 */
export const coursesHandler = {
  async list(params: CourseParams = {}): Promise<Course[]> {
    await delay();
    const found = params.search
      ? search(mockCourses, params.search, ['titulo', 'descricao', 'competenciaCentral'])
      : [...mockCourses];
    return paginate(sort(found, (course) => course.titulo), params).items;
  },

  async detail(slug: string): Promise<Course | null> {
    await delay();
    return mockCourses.find((course) => course.slug === slug) ?? null;
  },

  async module(courseSlug: string, moduleId: string): Promise<Course['modulos'][number] | null> {
    await delay();
    const course = mockCourses.find((item) => item.slug === courseSlug);
    return course?.modulos.find((item) => item.id === moduleId) ?? null;
  },
};
