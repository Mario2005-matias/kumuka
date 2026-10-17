import type { Course, CourseLevel, CourseModule, CourseProgress } from '@/types/course';
import { mockCourses } from '../data/courses';
import type { PaginationParams } from '../types/mock.types';
import { delay } from '../utils/delay';
import { paginate } from '../utils/paginate';
import { search } from '../utils/search';
import { sort } from '../utils/sort';
import { courseProgressHandler } from './courseProgress.handler';

type CourseParams = PaginationParams & {
  search?: string;
  nivel?: CourseLevel;
  categoria?: string;
  duracao?: 'menos-5' | '5-10' | 'mais-10';
  acesso?: Course['acesso'];
};

export const coursesHandler = {
  async list(params: CourseParams = {}): Promise<Course[]> {
    await delay();
    let found = mockCourses.filter((course) => course.status === 'published');
    if (params.search) {
      found = search(found, params.search, [
        'titulo',
        'descricao',
        'descricaoLonga',
        'competenciaCentral',
        'categoria',
      ]);
    }
    if (params.nivel) found = found.filter((course) => course.nivel === params.nivel);
    if (params.categoria) {
      found = found.filter(
        (course) => course.categoria.toLocaleLowerCase() === params.categoria?.toLocaleLowerCase(),
      );
    }
    if (params.acesso) found = found.filter((course) => course.acesso === params.acesso);
    if (params.duracao === 'menos-5') found = found.filter((course) => course.duracao < 5);
    if (params.duracao === '5-10') {
      found = found.filter((course) => course.duracao >= 5 && course.duracao <= 10);
    }
    if (params.duracao === 'mais-10') found = found.filter((course) => course.duracao > 10);
    return paginate(sort(found, (course) => course.titulo), params).items;
  },

  async detail(slug: string): Promise<Course | null> {
    await delay();
    return (
      mockCourses.find((course) => course.slug === slug && course.status === 'published') ??
      null
    );
  },

  async module(courseSlug: string, moduleId: string): Promise<CourseModule | null> {
    await delay();
    const course = mockCourses.find((item) => item.slug === courseSlug);
    return course?.modulos.find((item) => item.id === moduleId) ?? null;
  },

  async progress(userId: string, courseId: string): Promise<CourseProgress> {
    return courseProgressHandler.get(userId, courseId);
  },
  async start(userId: string, courseId: string): Promise<CourseProgress> {
    return courseProgressHandler.start(userId, courseId);
  },
  async markContentRead(
    userId: string,
    courseId: string,
    moduleId: string,
    contentId: string,
  ): Promise<CourseProgress> {
    return courseProgressHandler.markContentRead(userId, courseId, moduleId, contentId);
  },
  async saveDraft(
    userId: string,
    courseId: string,
    moduleId: string,
    answer: string,
  ): Promise<CourseProgress> {
    return courseProgressHandler.saveDraft(userId, courseId, moduleId, answer);
  },
  async submitActivity(
    userId: string,
    courseId: string,
    moduleId: string,
    answer: string,
  ): Promise<CourseProgress> {
    return courseProgressHandler.submitActivity(userId, courseId, moduleId, answer);
  },
  async completeModule(
    userId: string,
    courseId: string,
    moduleId: string,
  ): Promise<CourseProgress> {
    return courseProgressHandler.completeModule(userId, courseId, moduleId);
  },
  async completeCourse(userId: string, courseId: string): Promise<CourseProgress> {
    return courseProgressHandler.completeCourse(userId, courseId);
  },
};
