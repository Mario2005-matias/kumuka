import { mockProjects } from '../data/projects';
import { delay } from '../utils/delay';
import { paginate } from '../utils/paginate';
import { search } from '../utils/search';
import { sort } from '../utils/sort';
import type { PaginationParams } from '../types/mock.types';
import type { Project } from '@/types/project';

type ProjectParams = PaginationParams & { search?: string };

/**
 * Handler de projectos de portefólio.
 * Simula GET /api/projects e GET /api/projects/:slug.
 */
export const projectsHandler = {
  async list(params: ProjectParams = {}): Promise<Project[]> {
    await delay();
    const found = params.search
      ? search(mockProjects, params.search, ['titulo', 'descricao'])
      : [...mockProjects];
    return paginate(sort(found, (project) => project.titulo), params).items;
  },

  async detail(slug: string): Promise<Project | null> {
    await delay();
    return mockProjects.find((project) => project.slug === slug) ?? null;
  },
};
