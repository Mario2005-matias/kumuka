import { mockGuides } from '../data/guides';
import { delay } from '../utils/delay';
import { paginate } from '../utils/paginate';
import { search } from '../utils/search';
import { sort } from '../utils/sort';
import type { PaginationParams } from '../types/mock.types';
import type { Guide } from '@/types/guide';

type GuideParams = PaginationParams & { search?: string };

/**
 * Handler de guias.
 * Simula GET /api/guides e GET /api/guides/:slug.
 */
export const guidesHandler = {
  async list(params: GuideParams = {}): Promise<Guide[]> {
    await delay();
    const found = params.search
      ? search(mockGuides, params.search, ['titulo', 'descricao', 'categoria'])
      : [...mockGuides];
    return paginate(sort(found, (guide) => guide.titulo), params).items;
  },

  async detail(slug: string): Promise<Guide | null> {
    await delay();
    return mockGuides.find((guide) => guide.slug === slug) ?? null;
  },
};
