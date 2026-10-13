import { mockExperiences } from '../data/experiences';
import { delay } from '../utils/delay';
import { paginate } from '../utils/paginate';
import { search } from '../utils/search';
import { sort } from '../utils/sort';
import type { PaginationParams } from '../types/mock.types';
import type { Experience } from '@/types/experience';

type ExperienceParams = PaginationParams & { search?: string };

/**
 * Handler de experiências.
 * Simula GET /api/experiences e GET /api/experiences/:slug.
 */
export const experiencesHandler = {
  async list(params: ExperienceParams = {}): Promise<Experience[]> {
    await delay();
    const found = params.search
      ? search(mockExperiences, params.search, ['titulo', 'descricao', 'local'])
      : [...mockExperiences];
    return paginate(sort(found, (experience) => experience.data), params).items;
  },

  async detail(slug: string): Promise<Experience | null> {
    await delay();
    return mockExperiences.find((experience) => experience.slug === slug) ?? null;
  },
};
